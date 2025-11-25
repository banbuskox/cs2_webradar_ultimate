#include "pch.hpp"

#define TICK_INTERVAL 0.015625f
#define TICKS_TO_TIME(t) (TICK_INTERVAL*(t))

bool f::grenades::get_smoke(c_smoke_grenade* smoke)
{
	const auto curtime = i::m_global_vars->m_curtime();

	const auto dis_time = 21.5f - (curtime - TICKS_TO_TIME(smoke->m_nSmokeEffectTickBegin()));
	if (dis_time <= 0.f)
		return false;

	const auto detPos = smoke->m_vSmokeDetonationPos();

	if (detPos.is_zero())
		return false;

	m_grenade_data["m_type"] = "smoke";
	m_grenade_data["m_timeleft"] = dis_time;
	m_grenade_data["m_x"] = detPos.m_x;
	m_grenade_data["m_y"] = detPos.m_y;

	return true;
}

bool f::grenades::get_molo(c_molo_grenade* molo)
{
	const auto curtime = i::m_global_vars->m_curtime();
	const auto fireBurning = molo->m_bFireIsBurning();
	const auto firePositions = molo->m_firePositions();
	const auto nadeTime = 7.f;

	const auto dis_time = nadeTime - (curtime - TICKS_TO_TIME(molo->m_nFireEffectTickBegin()));
	if (dis_time <= 0.f)
		return false;

	const auto vec_origin = molo->m_pGameSceneNode()->m_vecOrigin();

	
	m_grenade_data["m_firePositions"] = nlohmann::json{};

	for (int i = 0; i <= molo->m_fireCount(); i++)
	{
		if (!fireBurning[i])
			continue;

		m_grenade_data["m_firePositions"].push_back({ firePositions[i].m_x, firePositions[i].m_y });
	}

	if (m_grenade_data["m_firePositions"].empty())
		return false;

	m_grenade_data["m_type"] = "molo";
	m_grenade_data["m_timeleft"] = dis_time;
	m_grenade_data["m_x"] = vec_origin.m_x;
	m_grenade_data["m_y"] = vec_origin.m_y;

	return true;
}

bool f::grenades::get_thrown(c_base_grenade* nade) 
{
	const auto nadePos = nade->m_pGameSceneNode()->m_vecOrigin();
	auto designer_name = nade->m_pEntity()->m_designerName();

	if (designer_name.empty())
		return false;

	designer_name.erase(designer_name.end() - 11, designer_name.end());

	if (nadePos.is_zero())
		return false;

	m_grenade_thrown_data["m_type"] = designer_name;
	m_grenade_thrown_data["m_x"] = nadePos.m_x;
	m_grenade_thrown_data["m_y"] = nadePos.m_y;

	return true;
}