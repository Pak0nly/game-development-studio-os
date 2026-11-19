// Typed view of Source/Shared/ink_tuning.json. Every number is kept as a
// double, exactly as the JavaScript core sees it, so that a later re-tuning
// (even to fractional values) behaves the same in both implementations.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public sealed class InkTuning
    {
        public string Version;

        // canvas
        public int CanvasWidth, CanvasHeight;
        // ink
        public double FigureBudget, WeaponBudget, MinBodyCells, WeaponMinBodyCells;
        // stats
        public double SharpMinEmptyNeighbours, ArmourBase, ArmourPerCore, ArmourPerCell, SharpBase,
            SharpPerSharpCell, SharpPerSharpShare, SharpPerSharpShareSquared, SpeedBase, SpeedWeightRef, BluntDamage;
        // element
        public double MinColouredPercent, StrongMult, WeakMult;
        public double[] Beats;
        // physics
        public double TickRate, HitCooldownTicks, Restitution, AccelBase, AccelWeightRef, TurnBase, TurnInertiaRef,
            DashSpeedMult, DashTicks, DashCooldownTicks, DashAccel, HitKnockbackPerDamage;
        // ring
        public double[] RingStartRadius;
        public double RingEndRadius, ShrinkStartTick, ShrinkEndTick, SuddenDeathTick, SuddenDeathShrinkPerTick,
            StartDistanceFraction, WinsToTakeMatch, CatchUpPercentPerLostRound, CatchUpMaxSteps, DrawTimeSeconds;
        // bots
        public double EdgeMargin, EdgeBlend, InsideBias, DashRange, DashChancePercent, WobbleTicks, WobbleStrength,
            LightRetreatFraction, RoundaboutDot, RoundaboutStrength;
        // solo
        public double ArenaRadius;
        public double[] WaveBudgets, Stakes, UpgradeCost;
        public double MaxCopies, EnemyInkBudget, EnemySpawnInset, EnemySpeedMult, EnemyArmourMult, EnemyDamageMult,
            EnemyDashRange, EnemyDashChancePercent, ThrowIntervalBaseTicks, ThrowIntervalTicksPerInk, ThrowSpeedBase,
            ThrowSpeedWeightRef, ProjectileLifeTicks, ProjectileRadiusMax, WeaponKnockbackPerInk, DropLifeTicks,
            PickupRange, WaveMaxTicks, UpgradeHeroInk, UpgradeWeaponInk, UpgradeHealPercent, BossArmourMult,
            BossEscortCopies, BotFleeDistance, BotWallMargin;

        public static InkTuning FromJson(string text)
        {
            object root = InkJson.Parse(text);
            InkTuning t = new InkTuning();
            t.Version = InkJson.Str(InkJson.Get(root, "version"));

            object o = InkJson.Get(root, "canvas");
            t.CanvasWidth = (int)N(o, "width");
            t.CanvasHeight = (int)N(o, "height");

            o = InkJson.Get(root, "ink");
            t.FigureBudget = N(o, "figureBudget");
            t.WeaponBudget = N(o, "weaponBudget");
            t.MinBodyCells = N(o, "minBodyCells");
            t.WeaponMinBodyCells = N(o, "weaponMinBodyCells");

            o = InkJson.Get(root, "stats");
            t.SharpMinEmptyNeighbours = N(o, "sharpMinEmptyNeighbours");
            t.ArmourBase = N(o, "armourBase");
            t.ArmourPerCore = N(o, "armourPerCore");
            t.ArmourPerCell = N(o, "armourPerCell");
            t.SharpBase = N(o, "sharpBase");
            t.SharpPerSharpCell = N(o, "sharpPerSharpCell");
            t.SharpPerSharpShare = N(o, "sharpPerSharpShare");
            t.SharpPerSharpShareSquared = N(o, "sharpPerSharpShareSquared");
            t.SpeedBase = N(o, "speedBase");
            t.SpeedWeightRef = N(o, "speedWeightRef");
            t.BluntDamage = N(o, "bluntDamage");

            o = InkJson.Get(root, "element");
            t.MinColouredPercent = N(o, "minColouredPercent");
            t.StrongMult = N(o, "strongMult");
            t.WeakMult = N(o, "weakMult");
            t.Beats = InkJson.NumArray(InkJson.Get(o, "beats"));

            o = InkJson.Get(root, "physics");
            t.TickRate = N(o, "tickRate");
            t.HitCooldownTicks = N(o, "hitCooldownTicks");
            t.Restitution = N(o, "restitution");
            t.AccelBase = N(o, "accelBase");
            t.AccelWeightRef = N(o, "accelWeightRef");
            t.TurnBase = N(o, "turnBase");
            t.TurnInertiaRef = N(o, "turnInertiaRef");
            t.DashSpeedMult = N(o, "dashSpeedMult");
            t.DashTicks = N(o, "dashTicks");
            t.DashCooldownTicks = N(o, "dashCooldownTicks");
            t.DashAccel = N(o, "dashAccel");
            t.HitKnockbackPerDamage = N(o, "hitKnockbackPerDamage");

            o = InkJson.Get(root, "ring");
            t.RingStartRadius = InkJson.NumArray(InkJson.Get(o, "startRadius"));
            t.RingEndRadius = N(o, "endRadius");
            t.ShrinkStartTick = N(o, "shrinkStartTick");
            t.ShrinkEndTick = N(o, "shrinkEndTick");
            t.SuddenDeathTick = N(o, "suddenDeathTick");
            t.SuddenDeathShrinkPerTick = N(o, "suddenDeathShrinkPerTick");
            t.StartDistanceFraction = N(o, "startDistanceFraction");
            t.WinsToTakeMatch = N(o, "winsToTakeMatch");
            t.CatchUpPercentPerLostRound = N(o, "catchUpPercentPerLostRound");
            t.CatchUpMaxSteps = N(o, "catchUpMaxSteps");
            t.DrawTimeSeconds = N(o, "drawTimeSeconds");

            o = InkJson.Get(root, "bots");
            t.EdgeMargin = N(o, "edgeMargin");
            t.EdgeBlend = N(o, "edgeBlend");
            t.InsideBias = N(o, "insideBias");
            t.DashRange = N(o, "dashRange");
            t.DashChancePercent = N(o, "dashChancePercent");
            t.WobbleTicks = N(o, "wobbleTicks");
            t.WobbleStrength = N(o, "wobbleStrength");
            t.LightRetreatFraction = N(o, "lightRetreatFraction");
            t.RoundaboutDot = N(o, "roundaboutDot");
            t.RoundaboutStrength = N(o, "roundaboutStrength");

            o = InkJson.Get(root, "solo");
            t.ArenaRadius = N(o, "arenaRadius");
            t.WaveBudgets = InkJson.NumArray(InkJson.Get(o, "waveBudgets"));
            t.Stakes = InkJson.NumArray(InkJson.Get(o, "stakes"));
            t.MaxCopies = N(o, "maxCopies");
            t.EnemyInkBudget = N(o, "enemyInkBudget");
            t.EnemySpawnInset = N(o, "enemySpawnInset");
            t.EnemySpeedMult = N(o, "enemySpeedMult");
            t.EnemyArmourMult = N(o, "enemyArmourMult");
            t.EnemyDamageMult = N(o, "enemyDamageMult");
            t.EnemyDashRange = N(o, "enemyDashRange");
            t.EnemyDashChancePercent = N(o, "enemyDashChancePercent");
            t.ThrowIntervalBaseTicks = N(o, "throwIntervalBaseTicks");
            t.ThrowIntervalTicksPerInk = N(o, "throwIntervalTicksPerInk");
            t.ThrowSpeedBase = N(o, "throwSpeedBase");
            t.ThrowSpeedWeightRef = N(o, "throwSpeedWeightRef");
            t.ProjectileLifeTicks = N(o, "projectileLifeTicks");
            t.ProjectileRadiusMax = N(o, "projectileRadiusMax");
            t.WeaponKnockbackPerInk = N(o, "weaponKnockbackPerInk");
            t.DropLifeTicks = N(o, "dropLifeTicks");
            t.PickupRange = N(o, "pickupRange");
            t.WaveMaxTicks = N(o, "waveMaxTicks");
            t.UpgradeCost = InkJson.NumArray(InkJson.Get(o, "upgradeCost"));
            t.UpgradeHeroInk = N(o, "upgradeHeroInk");
            t.UpgradeWeaponInk = N(o, "upgradeWeaponInk");
            t.UpgradeHealPercent = N(o, "upgradeHealPercent");
            t.BossArmourMult = N(o, "bossArmourMult");
            t.BossEscortCopies = N(o, "bossEscortCopies");
            t.BotFleeDistance = N(o, "botFleeDistance");
            t.BotWallMargin = N(o, "botWallMargin");
            return t;
        }

        private static double N(object o, string key)
        {
            return InkJson.Num(InkJson.Get(o, key));
        }
    }
}
