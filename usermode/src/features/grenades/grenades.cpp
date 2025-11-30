#include "pch.hpp"

#define TICK_INTERVAL 0.015625f
#define TICKS_TO_TIME(t) (TICK_INTERVAL*(t))

bool f::grenades::get_smoke(c_smoke_grenade* smoke)
{
	const auto begin_tick = smoke->m_nSmokeEffectTickBegin();
	if (begin_tick <= 0)
		return false;

	const auto curtime = i::m_global_vars->m_curtime();

	const auto dis_time = 21.5f - (curtime - TICKS_TO_TIME(begin_tick));
	if (dis_time <= 0.f)
		return false;

	const auto det_pos = smoke->m_vSmokeDetonationPos();
	if (det_pos.is_zero())
		return false;

	m_grenade_data = {
		{"m_type", "smoke"},
		{"m_timeleft", dis_time},
		{"m_x", det_pos.m_x},
		{"m_y", det_pos.m_y}
	};

	return true;
}

bool f::grenades::get_molo(c_molo_grenade* molo)
{
	const auto curtime = i::m_global_vars->m_curtime();
	const auto begin_tick = molo->m_nFireEffectTickBegin();

	const auto dis_time = 7.f - (curtime - TICKS_TO_TIME(begin_tick));
	if (dis_time <= 0.f)
		return false;

	const auto scene_node = molo->m_pGameSceneNode();
	if (!scene_node)
		return false;

	const auto vec_origin = scene_node->m_vecOrigin();

	auto firePosLocal = nlohmann::json{};

	const auto fireBurning = molo->m_bFireIsBurning();
	const auto firePositions = molo->m_firePositions();
	const int fireCount = molo->m_fireCount();

	for (int i = 0; i <= fireCount; i++)
	{
		if (!fireBurning[i])
			continue;

		firePosLocal.push_back({ firePositions[i].m_x, firePositions[i].m_y });
	}

	if (firePosLocal.empty())
		return false;

	m_grenade_data = {
		{"m_type", "molo"},
		{"m_timeleft", dis_time},
		{"m_x", vec_origin.m_x},
		{"m_y", vec_origin.m_y},
		{"m_firePositions", std::move(firePosLocal)}
	};

	return true;
}

bool f::grenades::get_thrown(c_base_grenade* nade) 
{
	const auto scene_node = nade->m_pGameSceneNode();
	if (!scene_node)
		return false;
	
	const auto nadePos = scene_node->m_vecOrigin();
	if (nadePos.is_zero())
		return false;
	
	const std::string designer_name_stor = nade->m_pEntity()->m_designerName();
	std::string_view designer_name = designer_name_stor;
	if (designer_name.empty())
		return false;

	designer_name.remove_suffix(11);

	m_grenade_thrown_data = {
		{"m_type", designer_name},
		{"m_x", nadePos.m_x},
		{"m_y", nadePos.m_y}
	};

	return true;
}