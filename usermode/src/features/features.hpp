#pragma once

namespace hashes
{
	//entities
	const auto PLAYER_CONTROLLER = fnv1a::hash_const("CCSPlayerController");
	const auto C4 = fnv1a::hash_const("C_C4");
	const auto PLANTED_C4 = fnv1a::hash_const("C_PlantedC4");
	const auto SMOKE = fnv1a::hash_const("C_SmokeGrenadeProjectile");
	const auto INFERNO = fnv1a::hash_const("C_Inferno");
	const auto HE = fnv1a::hash_const("C_HEGrenadeProjectile");
	const auto FLASH = fnv1a::hash_const("C_FlashbangProjectile");
	const auto DECOY = fnv1a::hash_const("C_DecoyProjectile");
	const auto MOLOTOV = fnv1a::hash_const("C_MolotovProjectile");

	//maps
	const auto DE_DUST2 = fnv1a::hash_const("de_dust2");
	const auto DE_ANCIENT = fnv1a::hash_const("de_ancient");
	const auto DE_ANUBIS = fnv1a::hash_const("de_anubis");
	const auto DE_INFERNO = fnv1a::hash_const("de_inferno");
	const auto DE_MIRAGE = fnv1a::hash_const("de_mirage");
	const auto DE_NUKE = fnv1a::hash_const("de_nuke");
	const auto DE_OVERPASS = fnv1a::hash_const("de_overpass");
	const auto DE_VERTIGO = fnv1a::hash_const("de_vertigo");
	const auto DE_TRAIN = fnv1a::hash_const("de_train");
}

namespace f::features_vars
{
	inline std::string map_name = "";
	inline int bomb_dmg = 0;
	inline int bomb_radius = 0;
	inline f_vector bomb_vec;
	inline float bomb_blow_time = 0.f;
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
	int calculate_bomb_damage(const f_vector* playerVec, const int32_t* playerArmor);
	void update_bomb_dmg_info(std::string map);
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