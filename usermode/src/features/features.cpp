#include "pch.hpp"

bool f::run()
{
	const auto local_team = sdk::m_local_controller->m_iTeamNum();
	if (local_team == e_team::none || local_team == e_team::spec)
		return false;

	m_data.clear();
	m_player_data.clear();

	m_data["m_local_team"] = local_team;

	get_map();
	get_player_info();
	return true;
}

void f::get_map()
{
	const auto map_name = i::m_global_vars->m_map_name();
	if (map_name.empty() || map_name.find("<empty>") != std::string::npos || map_name == "SetVelocityLimit")
	{
		m_data["m_map"] = "invalid";

		LOG_WARNING("Failed to get map name! Updating m_global_vars!");
		i::m_global_vars = m_memory->read_t<c_global_vars*>(m_memory->find_pattern(CLIENT_DLL, GET_GLOBAL_VARS)->rip().as<c_global_vars*>());
	}

	m_data["m_map"] = map_name;
}

void f::get_player_info()
{
	m_data["m_players"].clear();
	m_data["m_grenades"]["landed"].clear();
	m_data["m_grenades"]["thrown"].clear();
	m_data["m_dropped_weapons"].clear();

	auto* entity_system = i::m_game_entity_system;

	const int32_t highest_idx = 1024;

	for (int32_t idx = 0; idx < highest_idx; idx++)
	{
		const auto entity = entity_system->get(idx);
		if (!entity) continue;

		const auto entity_handle = entity->get_ref_e_handle();
		if (!entity_handle.is_valid()) continue;

		const auto class_name = entity->get_schema_class_name();
		if (class_name.empty()) continue;

		const auto hashed_class_name = fnv1a::hash(class_name);

		if (hashed_class_name == hashes::PLAYER_CONTROLLER) {
			const auto player = i::m_game_entity_system->get<c_cs_player_controller*>(entity_handle);
			if (!player)
				continue;

			const auto player_pawn = player->get_player_pawn();
			if (!player_pawn)
				continue;

			if (!f::players::get_data(idx, player, player_pawn))
				continue;

			f::players::get_weapons(player_pawn);
			f::players::get_active_weapon(player_pawn);

			m_data["m_players"].push_back(m_player_data);
			continue;
		}

		switch (hashed_class_name) {
			case hashes::C4:
				f::bomb::get_carried_bomb(entity);
				break;

			case hashes::PLANTED_C4:
				f::bomb::get_planted_bomb(reinterpret_cast<c_planted_c4*>(entity));
				break;

			case hashes::SMOKE:
				m_grenade_data.clear();
				m_grenade_thrown_data.clear();

				if (!f::grenades::get_smoke(reinterpret_cast<c_smoke_grenade*>(entity))) {
					if (f::grenades::get_thrown(reinterpret_cast<c_base_grenade*>(entity))) {

						m_grenade_thrown_data["m_idx"] = idx;
						m_data["m_grenades"]["thrown"].push_back(m_grenade_thrown_data);

					}
					continue;
				}

				m_data["m_grenades"]["landed"].push_back(m_grenade_data);
				break;

			case hashes::INFERNO:
				m_grenade_data.clear();

				if (!f::grenades::get_molo(reinterpret_cast<c_molo_grenade*>(entity)))
					continue;

				m_data["m_grenades"]["landed"].push_back(m_grenade_data);
				break;

			case hashes::HE:
			case hashes::FLASH:
			case hashes::DECOY:
			case hashes::MOLOTOV:
				m_grenade_thrown_data.clear();

				if (!f::grenades::get_thrown(reinterpret_cast<c_base_grenade*>(entity)))
					continue;

				m_grenade_thrown_data["m_idx"] = idx;

				m_data["m_grenades"]["thrown"].push_back(m_grenade_thrown_data);
				break;

			default:
				if (f::dropped_weapons::is_weapon(entity->m_pEntity()->m_designerName()))
				{
					m_dropped_weapon_data.clear();

					if (!f::dropped_weapons::get_weapon(reinterpret_cast<c_base_entity*>(entity)))
						continue;

					m_dropped_weapon_data["m_idx"] = idx;

					m_data["m_dropped_weapons"].push_back(m_dropped_weapon_data);
				}
				break;
		}
	}
}