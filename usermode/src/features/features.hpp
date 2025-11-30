#pragma once

namespace hashes
{
	const auto PLAYER_CONTROLLER = fnv1a::hash_const("CCSPlayerController");
	const auto C4 = fnv1a::hash_const("C_C4");
	const auto PLANTED_C4 = fnv1a::hash_const("C_PlantedC4");
	const auto SMOKE = fnv1a::hash_const("C_SmokeGrenadeProjectile");
	const auto INFERNO = fnv1a::hash_const("C_Inferno");
	const auto HE = fnv1a::hash_const("C_HEGrenadeProjectile");
	const auto FLASH = fnv1a::hash_const("C_FlashbangProjectile");
	const auto DECOY = fnv1a::hash_const("C_DecoyProjectile");
	const auto MOLOTOV = fnv1a::hash_const("C_MolotovProjectile");
}

namespace f::players
{
	bool get_data(int32_t idx, c_cs_player_controller* player, c_cs_player_pawn* player_pawn);
	void get_weapons(c_cs_player_pawn* player_pawn);
	void get_active_weapon(c_cs_player_pawn* player_pawn);
}

namespace f::bomb
{
	void get_carried_bomb(c_base_entity* bomb);
	void get_planted_bomb(c_planted_c4* planted_c4);
}

namespace f::dropped_weapons
{
	bool is_weapon(const std::string_view weapon_name);
	bool get_weapon(c_base_entity* weapon);
}

namespace f::grenades
{
	bool get_smoke(c_smoke_grenade* smoke);
	bool get_molo(c_molo_grenade* molo);
	bool get_thrown(c_base_grenade* nade);
}

namespace f
{
	bool run();
	void get_map();
	void get_player_info();

	inline nlohmann::json m_data = {};
	inline nlohmann::json m_player_data = {};
	inline nlohmann::json m_grenade_data = {};
	inline nlohmann::json m_grenade_thrown_data = {};
	inline nlohmann::json m_dropped_weapon_data = {};
	inline uint32_t m_bomb_idx = 0;
}