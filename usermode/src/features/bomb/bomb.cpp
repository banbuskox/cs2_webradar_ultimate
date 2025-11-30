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

	const auto curtime = i::m_global_vars->m_curtime();
	const auto blow_time = (planted_c4->m_flC4Blow() - curtime);
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