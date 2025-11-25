#include "pch.hpp"

bool f::dropped_weapons::is_weapon(const std::string& weapon_name)
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

	std::string weapon_name = reinterpret_cast<c_base_player_weapon*>(weapon)->m_WeaponData()->m_szName();

	if (weapon_name.empty())
		return false;

	weapon_name.erase(weapon_name.begin(), weapon_name.begin() + 7);

	if (vec_origin.is_zero())
		return false;


	m_dropped_weapon_data["m_name"] = weapon_name;
	m_dropped_weapon_data["m_x"] = vec_origin.m_x;
	m_dropped_weapon_data["m_y"] = vec_origin.m_y;

	return true;
}