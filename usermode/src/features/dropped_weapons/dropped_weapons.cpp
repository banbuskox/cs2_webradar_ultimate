#include "pch.hpp"

bool f::dropped_weapons::is_weapon(const std::string_view weapon_name)
{
	if (weapon_name.size() < 10 || weapon_name.size() > 20) return false;

	return weapon_name.starts_with("weapon_");
}

bool f::dropped_weapons::get_weapon(c_base_entity* weapon)
{
	const auto scene_node = weapon->m_pGameSceneNode();
	if (!scene_node) 
		return false;

	const auto vec_origin = scene_node->m_vecOrigin();
	if (vec_origin.is_zero())
		return false;

	const auto base_weapon = reinterpret_cast<c_base_player_weapon*>(weapon);
	const auto base_weapon_data = base_weapon->m_WeaponData();
	if (!base_weapon_data)
		return false;

	const std::string weapon_name = base_weapon_data->m_szName();
	if (weapon_name.empty())
		return false;

	const char* name_read_ptr = weapon_name.c_str();
	name_read_ptr += 7;

	if (vec_origin.is_zero())
		return false;


	m_dropped_weapon_data = {
		{"m_name", name_read_ptr},
		{"m_x", vec_origin.m_x},
		{"m_y", vec_origin.m_y}
	};

	return true;
}