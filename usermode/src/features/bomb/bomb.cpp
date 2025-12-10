#include "pch.hpp"

void f::bomb::get_carried_bomb(c_base_entity* bomb)
{
	const auto owner_handle = bomb->m_hOwnerEntity();
	const auto owner_int = *reinterpret_cast<const uint32_t*>(&owner_handle);

	m_bomb_idx = owner_int & 0x7FFF;

	const auto scene_origin = bomb->get_scene_origin();
	if (scene_origin.is_zero())
		return;

	m_data["m_bomb"] = {
		{"x", scene_origin.m_x},
		{"y", scene_origin.m_y},
		{"owner_entity", owner_int}
	};

}

void f::bomb::get_planted_bomb(c_planted_c4* planted_c4)
{
	if (!planted_c4->m_bBombTicking())
		return;

	const auto scene_node = planted_c4->m_pGameSceneNode();
	if (!scene_node)
		return;

	const auto vec_origin = scene_node->m_vecAbsOrigin();
	if (vec_origin.is_zero())
		return;
	f::features_vars::bomb_vec = vec_origin;

	const auto curtime = i::m_global_vars->m_curtime();
	const auto blow_time = (planted_c4->m_flC4Blow() - curtime);
	f::features_vars::bomb_blow_time = blow_time;
	if (blow_time <= 0.f)
		return;

	const auto is_defused = planted_c4->m_bBombDefused();
	const auto is_defusing = planted_c4->m_bBeingDefused();
	const auto defuse_time = (planted_c4->m_flDefuseCountDown() - curtime);

	m_data["m_bomb"] = {
		{"x", vec_origin.m_x},
		{"y", vec_origin.m_y},
		{"m_blow_time", blow_time},
		{"m_is_defused", is_defused},
		{"m_is_defusing", is_defusing},
		{"m_defuse_time", defuse_time}
	};
}

int f::bomb::calculate_bomb_damage(const f_vector* playerVec, const int32_t* playerArmor)
{
	if (f::features_vars::bomb_blow_time <= 0.f) 
		return 0;
	
	const float sigma = static_cast<double>(f::features_vars::bomb_radius / 3.0);
	const float distance = playerVec->dist_to(f::features_vars::bomb_vec);
	const float damage = f::features_vars::bomb_dmg * std::exp( -(distance*distance) / (2.0f * sigma * sigma) );
	const int armor_value = *playerArmor;
	float damage_armor = damage;

	if (armor_value > 0) {
		const float armor_bonus = 0.5f;
		float damage_to_armor = damage * armor_bonus;

		if (damage_to_armor <= armor_value) {
			damage_armor = damage - damage_to_armor;
		} else {
			damage_armor = damage - armor_value;
		}
	}

	return std::clamp(static_cast<int>(std::round(damage_armor)), 0, 100);
};

void f::bomb::update_bomb_dmg_info(std::string map_name) {
	const auto hashed_map_name = fnv1a::hash(map_name);
	switch (hashed_map_name) {
		case hashes::DE_DUST2:
			f::features_vars::bomb_dmg = 700;
			f::features_vars::bomb_radius = 2450;
			break;
		case hashes::DE_NUKE:
		case hashes::DE_MIRAGE:
		case hashes::DE_ANCIENT:
		case hashes::DE_OVERPASS:
			f::features_vars::bomb_dmg = 650;
			f::features_vars::bomb_radius = 2275;
			break;
		case hashes::DE_INFERNO:
			f::features_vars::bomb_dmg = 600;
			f::features_vars::bomb_radius = 2100;
			break;
		case hashes::DE_TRAIN:
		case hashes::DE_VERTIGO:
			f::features_vars::bomb_dmg = 500;
			f::features_vars::bomb_radius = 1750;
			break;
		case hashes::DE_ANUBIS:
			f::features_vars::bomb_dmg = 450;
			f::features_vars::bomb_radius = 1575;
			break;
		default:
			f::features_vars::bomb_dmg = 500;
			f::features_vars::bomb_radius = 1750;
			break;
	}
}