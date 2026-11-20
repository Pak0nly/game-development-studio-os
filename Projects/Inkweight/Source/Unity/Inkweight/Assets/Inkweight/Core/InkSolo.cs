// Mode A "Solo Arena": hero plus thrown weapon, one enemy design per wave with
// copies paid from the wave budget, stakes, ink drops, upgrades, boss.
// Port of core/solo.js. Body 0 of the world is always the hero (team 0);
// enemies are team 1.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public sealed class InkShot
    {
        public double X, Y, Ux, Uy, Speed, Life;
    }

    public sealed class InkDrop
    {
        public double X, Y, Value, Life;
    }

    public sealed class InkSoloCheck
    {
        public bool Ok;
        public string Reason; // "" | "tooSmall" | "overBudget" | "colourLocked"
        public InkStats Stats;
    }

    public sealed class InkSoloRun
    {
        public uint Seed;
        public InkRng Rng;
        public string Phase;     // InkSolo.PhasePrepare | PhaseFight | PhaseCleared | PhaseDead | PhaseWon
        public string EndReason; // "armour" | "time" when the phase is dead
        public int Wave;         // index of the wave to start or being fought; 5 = boss
        public int W, H;
        public double HeroBudget, WeaponBudget;
        public bool[] Colours;   // index = colour number
        public InkFigure HeroFig, WeaponFig;
        public double HeroHp, HeroMaxHp;
        public List<int[]> EnemyDrawings = new List<int[]>(); // body cells of every wave design, for the boss
        public double Wallet, Score;
        public bool UpgradeTaken;
        public InkWorld World;
        public List<InkShot> Shots = new List<InkShot>();
        public List<InkDrop> Drops = new List<InkDrop>();
        public List<InkEvent> Events = new List<InkEvent>();
        public int Tick;
        public double ThrowCd;
        public int Copies;
        public double Stake = 1;
        public int StakeIndex;   // index into the stakes of the running wave (0 for the boss)
        public double DropValue; // ink of one drop in the running wave; 0 = the enemy's own N (boss fight)
    }

    public static class InkSolo
    {
        public const int Waves = 5; // the boss is fought as wave index 5

        public const string PhasePrepare = "prepare";
        public const string PhaseFight = "fight";
        public const string PhaseCleared = "cleared";
        public const string PhaseDead = "dead";
        public const string PhaseWon = "won";

        public const string KindHero = "hero";
        public const string KindWeapon = "weapon";
        public const string KindEnemy = "enemy";

        public const string UpgradeHeroInk = "heroInk";
        public const string UpgradeWeaponInk = "weaponInk";
        public const string UpgradeHeal = "heal";
        public const string UpgradeColour = "colour";

        // Check a drawing for the run. kind: "hero" | "weapon" | "enemy".
        public static InkSoloCheck CheckDrawing(InkTuning tuning, InkSoloRun run, int[] cells, int W, int H, string kind)
        {
            double budget = kind == KindHero ? run.HeroBudget : kind == KindWeapon ? run.WeaponBudget : tuning.EnemyInkBudget;
            InkStats stats = InkDrawing.ComputeStats(cells, W, H, tuning,
                kind == KindWeapon ? InkDrawing.KindWeapon : InkDrawing.KindFigure, budget);
            string reason = "";
            if (!stats.BigEnough) reason = "tooSmall";
            else if (!stats.WithinBudget) reason = "overBudget";
            else if (kind != KindEnemy)
            {
                for (int i = 0; i < cells.Length; i++)
                {
                    if (cells[i] != 0 && !run.Colours[cells[i]]) { reason = "colourLocked"; break; }
                }
            }
            InkSoloCheck c = new InkSoloCheck();
            c.Ok = reason == "";
            c.Reason = reason;
            c.Stats = stats;
            return c;
        }

        // startColour: 2, 3 or 4, the one colour the run starts with besides
        // Black (0 = Black only). Throws when a drawing is not valid.
        public static InkSoloRun CreateRun(InkTuning tuning, uint seed, int[] heroCells, int[] weaponCells, int W, int H, int startColour)
        {
            InkSoloRun run = new InkSoloRun();
            run.Seed = seed;
            run.Rng = InkRng.Create(seed);
            run.Phase = PhasePrepare;
            run.EndReason = "";
            run.W = W; run.H = H;
            run.HeroBudget = tuning.FigureBudget;
            run.WeaponBudget = tuning.WeaponBudget;
            run.Colours = new bool[] { false, true, startColour == 2, startColour == 3, startColour == 4 };
            InkSoloCheck chk = CheckDrawing(tuning, run, heroCells, W, H, KindHero);
            if (!chk.Ok) throw new ArgumentException("hero drawing: " + chk.Reason);
            chk = CheckDrawing(tuning, run, weaponCells, W, H, KindWeapon);
            if (!chk.Ok) throw new ArgumentException("weapon drawing: " + chk.Reason);
            run.HeroFig = InkPhysics.BuildFigure(heroCells, W, H, tuning, InkDrawing.KindFigure, run.HeroBudget);
            run.WeaponFig = InkPhysics.BuildFigure(weaponCells, W, H, tuning, InkDrawing.KindWeapon, run.WeaponBudget);
            run.HeroHp = run.HeroFig.Stats.Armour;
            run.HeroMaxHp = run.HeroHp;
            return run;
        }

        // Number of enemy copies a design gets in a wave. Every copy costs its
        // own ink plus the flat fee copyInkOverhead.
        public static int Copies(InkTuning so, int waveIndex, int stakeIndex, int N)
        {
            double copies = Math.Floor(so.WaveBudgets[waveIndex] * so.Stakes[stakeIndex] / (N + so.CopyInkOverhead));
            if (copies < 1) copies = 1;
            if (copies > so.MaxCopies) copies = so.MaxCopies;
            return (int)copies;
        }

        public static double ThrowIntervalTicks(InkTuning tuning, int weaponN)
        {
            return tuning.ThrowIntervalBaseTicks + Math.Floor(weaponN * tuning.ThrowIntervalTicksPerInk);
        }

        private static InkVec2 RandomUnit(InkSoloRun run)
        {
            for (;;)
            {
                double x = run.Rng.Float() * 2 - 1;
                double y = run.Rng.Float() * 2 - 1;
                double l2 = x * x + y * y;
                if (l2 > 0.01 && l2 <= 1)
                {
                    double l = Math.Sqrt(l2);
                    return new InkVec2(x / l, y / l);
                }
            }
        }

        private static void BeginFight(InkTuning tuning, InkSoloRun run, List<InkBody> enemyBodies)
        {
            InkBody hero = InkPhysics.CreateBody(run.HeroFig, 0, 0, 0, -1, 0, 1, 1, 1);
            hero.Hp = run.HeroHp;
            hero.MaxHp = run.HeroMaxHp;
            List<InkBody> bodies = new List<InkBody>();
            bodies.Add(hero);
            for (int i = 0; i < enemyBodies.Count; i++) bodies.Add(enemyBodies[i]);
            run.World = InkPhysics.CreateWorld(bodies, tuning.ArenaRadius);
            run.Shots = new List<InkShot>();
            run.Drops = new List<InkDrop>();
            run.Tick = 0;
            run.ThrowCd = ThrowIntervalTicks(tuning, run.WeaponFig.Stats.N);
            run.UpgradeTaken = false;
            run.Phase = PhaseFight;
        }

        // How much of the staked wave budget each copy carries, compared with
        // what a copy costs, limited to copyArmourScaleMin .. copyArmourScaleMax.
        public static double WaveArmourScale(InkTuning so, int waveIndex, int stakeIndex, int N)
        {
            double copies = Copies(so, waveIndex, stakeIndex, N);
            double scale = so.WaveBudgets[waveIndex] * so.Stakes[stakeIndex] / (copies * (N + so.CopyInkOverhead));
            if (scale < so.CopyArmourScaleMin) scale = so.CopyArmourScaleMin;
            if (scale > so.CopyArmourScaleMax) scale = so.CopyArmourScaleMax;
            return scale;
        }

        // Armour of one enemy copy: enemyArmourPerInk for every body cell plus
        // enemyArmourMult times the armour of the drawing, times the wave
        // scale (1 for boss escorts).
        public static double EnemyArmour(InkTuning so, InkFigure fig, double scale)
        {
            double dN = fig.Stats.N;
            double perInk = so.EnemyArmourPerInk * dN;
            double perArmour = so.EnemyArmourMult * fig.Stats.Armour;
            return (perInk + perArmour) * scale;
        }

        // isBoss: the boss keeps its full armour times bossArmourMult.
        private static InkBody SpawnEnemy(InkTuning so, InkSoloRun run, InkFigure fig, bool isBoss, int stakeIndex, double scale)
        {
            InkVec2 u = RandomUnit(run);
            double d = so.ArenaRadius - so.EnemySpawnInset;
            InkBody body = InkPhysics.CreateBody(fig, u.X * d, u.Y * d, -u.X, -u.Y, 1, 1,
                so.EnemySpeedMult * so.StakeSpeedMult[stakeIndex], so.EnemyDamageMult * so.StakeDamageMult[stakeIndex]);
            body.Hp = isBoss ? fig.Stats.Armour * so.BossArmourMult : EnemyArmour(so, fig, scale);
            body.MaxHp = body.Hp;
            return body;
        }

        // Ink of one drop in a wave: the staked wave budget divided by the
        // copies, rounded down.
        public static double DropValue(InkTuning so, int waveIndex, int stakeIndex, int N)
        {
            double copies = Copies(so, waveIndex, stakeIndex, N);
            return Math.Floor(so.WaveBudgets[waveIndex] * so.Stakes[stakeIndex] / copies);
        }

        // Start wave run.Wave (0..4) with the player's enemy drawing and stake index.
        public static void StartWave(InkTuning tuning, InkSoloRun run, int[] enemyCells, int stakeIndex)
        {
            if (run.Phase != PhasePrepare && run.Phase != PhaseCleared) throw new InvalidOperationException("cannot start a wave now");
            if (run.Wave >= Waves) throw new InvalidOperationException("all waves done, start the boss");
            if (stakeIndex < 0 || stakeIndex >= tuning.Stakes.Length) throw new ArgumentException("bad stake index");
            InkSoloCheck chk = CheckDrawing(tuning, run, enemyCells, run.W, run.H, KindEnemy);
            if (!chk.Ok) throw new ArgumentException("enemy drawing: " + chk.Reason);
            InkFigure fig = InkPhysics.BuildFigure(enemyCells, run.W, run.H, tuning, InkDrawing.KindFigure, tuning.EnemyInkBudget);
            run.EnemyDrawings.Add(InkDrawing.ExtractBody(enemyCells, run.W, run.H).Body);
            run.Copies = Copies(tuning, run.Wave, stakeIndex, fig.Stats.N);
            run.Stake = tuning.Stakes[stakeIndex];
            run.StakeIndex = stakeIndex;
            run.DropValue = DropValue(tuning, run.Wave, stakeIndex, fig.Stats.N);
            double scale = WaveArmourScale(tuning, run.Wave, stakeIndex, fig.Stats.N);
            List<InkBody> enemies = new List<InkBody>();
            for (int i = 0; i < run.Copies; i++) enemies.Add(SpawnEnemy(tuning, run, fig, false, stakeIndex, scale));
            BeginFight(tuning, run, enemies);
        }

        // The boss drawing: cell-wise union of the bodies of all wave designs;
        // where several designs have ink the earliest wave gives the colour.
        public static int[] BossCells(InkSoloRun run)
        {
            int total = run.W * run.H;
            int[] cells = new int[total];
            for (int w = 0; w < run.EnemyDrawings.Count; w++)
            {
                int[] d = run.EnemyDrawings[w];
                for (int i = 0; i < total; i++) if (cells[i] == 0 && d[i] != 0) cells[i] = d[i];
            }
            return cells;
        }

        public static void StartBoss(InkTuning so, InkSoloRun run)
        {
            if (run.Phase != PhaseCleared || run.Wave != Waves) throw new InvalidOperationException("boss not due");
            int total = run.W * run.H;
            InkFigure bossFig = InkPhysics.BuildFigure(BossCells(run), run.W, run.H, so, InkDrawing.KindFigure, total);
            List<InkBody> enemies = new List<InkBody>();
            enemies.Add(SpawnEnemy(so, run, bossFig, true, 0, 1));
            for (int w = 0; w < run.EnemyDrawings.Count; w++)
            {
                InkFigure fig = InkPhysics.BuildFigure(run.EnemyDrawings[w], run.W, run.H, so, InkDrawing.KindFigure, total);
                for (int c = 0; c < so.BossEscortCopies; c++) enemies.Add(SpawnEnemy(so, run, fig, false, 0, 1));
            }
            run.Copies = enemies.Count;
            run.Stake = 1;
            run.StakeIndex = 0;
            run.DropValue = 0;
            BeginFight(so, run, enemies);
        }

        // Upgrade between waves; one per break. kind: "heroInk" (cells = new
        // hero cells), "weaponInk" (cells = new weapon cells), "heal",
        // "colour" (colour = 2..4). Returns "" on success or the reason it failed.
        public static string Upgrade(InkTuning so, InkSoloRun run, string kind, int[] cells, int colour)
        {
            if (run.Phase != PhaseCleared) return "notNow";
            if (run.UpgradeTaken) return "alreadyTaken";
            double cost = so.UpgradeCost[run.Wave - 1];
            if (run.Wallet < cost) return "tooExpensive";
            if (kind == UpgradeHeroInk)
            {
                run.HeroBudget += so.UpgradeHeroInk;
                InkSoloCheck chk = CheckDrawing(so, run, cells, run.W, run.H, KindHero);
                if (!chk.Ok) { run.HeroBudget -= so.UpgradeHeroInk; return chk.Reason; }
                double damageTaken = run.HeroMaxHp - run.HeroHp;
                run.HeroFig = InkPhysics.BuildFigure(cells, run.W, run.H, so, InkDrawing.KindFigure, run.HeroBudget);
                run.HeroMaxHp = run.HeroFig.Stats.Armour;
                run.HeroHp = run.HeroMaxHp - damageTaken;
                if (run.HeroHp < 1) run.HeroHp = 1;
            }
            else if (kind == UpgradeWeaponInk)
            {
                run.WeaponBudget += so.UpgradeWeaponInk;
                InkSoloCheck chk = CheckDrawing(so, run, cells, run.W, run.H, KindWeapon);
                if (!chk.Ok) { run.WeaponBudget -= so.UpgradeWeaponInk; return chk.Reason; }
                run.WeaponFig = InkPhysics.BuildFigure(cells, run.W, run.H, so, InkDrawing.KindWeapon, run.WeaponBudget);
            }
            else if (kind == UpgradeHeal)
            {
                double heal = run.HeroMaxHp * so.UpgradeHealPercent / 100;
                run.HeroHp += heal;
                if (run.HeroHp > run.HeroMaxHp) run.HeroHp = run.HeroMaxHp;
            }
            else if (kind == UpgradeColour)
            {
                if (colour < 2 || colour > 4 || run.Colours[colour]) return "badColour";
                run.Colours[colour] = true;
            }
            else
            {
                return "unknownUpgrade";
            }
            run.Wallet -= cost;
            run.UpgradeTaken = true;
            return "";
        }

        // One tick of a wave. input is the hero's input.
        public static void Step(InkTuning so, InkSoloRun run, InkInput input)
        {
            if (run.Phase != PhaseFight) return;
            InkWorld world = run.World;
            List<InkBody> bodies = world.Bodies;
            int n = bodies.Count;
            InkBody hero = bodies[0];
            InkInput[] inputs = new InkInput[n];
            inputs[0] = input;
            for (int i = 1; i < n; i++) inputs[i] = InkBots.EnemyInput(so, run, i);
            InkPhysics.StepWorld(world, inputs, so);
            run.Tick++;
            run.Events = world.Events;
            InkStats wst = run.WeaponFig.Stats;
            double wN = wst.N;

            // throw at the nearest enemy
            run.ThrowCd--;
            if (run.ThrowCd <= 0)
            {
                int near = -1;
                double nearD2 = 0;
                for (int i = 1; i < n; i++)
                {
                    if (!bodies[i].Alive || bodies[i].Hp <= 0) continue; // an enemy already at 0 armour is no target
                    double dx = bodies[i].X - hero.X;
                    double dy = bodies[i].Y - hero.Y;
                    double d2 = dx * dx + dy * dy;
                    if (near == -1 || d2 < nearD2) { near = i; nearD2 = d2; }
                }
                if (near != -1 && nearD2 > 0)
                {
                    double d = Math.Sqrt(nearD2);
                    InkShot shot = new InkShot();
                    shot.X = hero.X; shot.Y = hero.Y;
                    shot.Ux = (bodies[near].X - hero.X) / d;
                    shot.Uy = (bodies[near].Y - hero.Y) / d;
                    shot.Speed = so.ThrowSpeedBase / (1 + wN / so.ThrowSpeedWeightRef);
                    shot.Life = so.ProjectileLifeTicks;
                    run.Shots.Add(shot);
                    run.ThrowCd = ThrowIntervalTicks(so, wst.N);
                    InkEvent e = new InkEvent();
                    e.Type = InkEvent.Throw;
                    run.Events.Add(e);
                }
            }

            // shots
            double dt = 1 / so.TickRate;
            double pr = run.WeaponFig.Radius;
            if (pr > so.ProjectileRadiusMax) pr = so.ProjectileRadiusMax;
            List<InkShot> keptShots = new List<InkShot>();
            for (int s = 0; s < run.Shots.Count; s++)
            {
                InkShot shot = run.Shots[s];
                double mx = shot.Ux * shot.Speed * dt;
                double my = shot.Uy * shot.Speed * dt;
                shot.X += mx;
                shot.Y += my;
                shot.Life--;
                int hit = -1;
                for (int i = 1; i < n && hit == -1; i++)
                {
                    InkBody e = bodies[i];
                    if (!e.Alive || e.Hp <= 0) continue; // a shot passes an enemy that is already at 0 armour
                    double dx = shot.X - e.X;
                    double dy = shot.Y - e.Y;
                    double reach = e.Fig.Radius + pr;
                    if (dx * dx + dy * dy >= reach * reach) continue;
                    InkFigure ef = e.Fig;
                    double c = -e.Fy;
                    double sn = e.Fx;
                    double rr = (pr + 0.5) * (pr + 0.5);
                    for (int bi = 0; bi < ef.Boundary.Length; bi++)
                    {
                        int k = ef.Boundary[bi];
                        double wx = e.X + c * ef.Lx[k] - sn * ef.Ly[k] - shot.X;
                        double wy = e.Y + sn * ef.Lx[k] + c * ef.Ly[k] - shot.Y;
                        if (wx * wx + wy * wy < rr) { hit = i; break; }
                    }
                }
                if (hit != -1)
                {
                    InkBody e = bodies[hit];
                    double dmg = wst.Sharpness * InkDrawing.ElementMultiplier(so, wst.Element, e.Fig.Stats.Element);
                    e.Hp -= dmg;
                    double kb = wN * so.WeaponKnockbackPerInk / e.Fig.Mass;
                    double kx = shot.Ux * kb;
                    double ky = shot.Uy * kb;
                    e.Vx += kx;
                    e.Vy += ky;
                    InkEvent ev = new InkEvent();
                    ev.Type = InkEvent.ShotHit; ev.To = hit; ev.Damage = dmg;
                    run.Events.Add(ev);
                }
                else if (shot.Life > 0)
                {
                    keptShots.Add(shot);
                }
            }
            run.Shots = keptShots;

            // enemy deaths leave ink
            int enemiesAlive = 0;
            for (int i = 1; i < n; i++)
            {
                InkBody e = bodies[i];
                if (!e.Alive) continue;
                if (e.Hp <= 0)
                {
                    e.Alive = false;
                    InkDrop drop = new InkDrop();
                    drop.X = e.X; drop.Y = e.Y; drop.Value = run.DropValue > 0 ? run.DropValue : e.Fig.Stats.N; drop.Life = so.DropLifeTicks;
                    run.Drops.Add(drop);
                    InkEvent ev = new InkEvent();
                    ev.Type = InkEvent.EnemyDown; ev.To = i;
                    run.Events.Add(ev);
                }
                else
                {
                    enemiesAlive++;
                }
            }

            // drops: pick up, then age
            List<InkDrop> keptDrops = new List<InkDrop>();
            double pick = hero.Fig.Radius + so.PickupRange;
            for (int d = 0; d < run.Drops.Count; d++)
            {
                InkDrop drop = run.Drops[d];
                double dx = drop.X - hero.X;
                double dy = drop.Y - hero.Y;
                if (dx * dx + dy * dy <= pick * pick)
                {
                    run.Wallet += drop.Value;
                    run.Score += drop.Value;
                    InkEvent ev = new InkEvent();
                    ev.Type = InkEvent.Pickup; ev.Damage = drop.Value;
                    run.Events.Add(ev);
                    continue;
                }
                drop.Life--;
                if (drop.Life > 0) keptDrops.Add(drop);
            }
            run.Drops = keptDrops;

            run.HeroHp = hero.Hp;
            if (hero.Hp <= 0)
            {
                hero.Alive = false;
                run.Phase = PhaseDead;
                run.EndReason = "armour";
                return;
            }
            if (enemiesAlive == 0)
            {
                // ink still lying around is collected when the wave ends
                for (int d = 0; d < run.Drops.Count; d++)
                {
                    run.Wallet += run.Drops[d].Value;
                    run.Score += run.Drops[d].Value;
                }
                run.Drops = new List<InkDrop>();
                run.Shots = new List<InkShot>();
                if (run.Wave == Waves)
                {
                    run.Phase = PhaseWon;
                }
                else
                {
                    run.Wave++;
                    run.Phase = PhaseCleared;
                }
                return;
            }
            if (run.Tick >= so.WaveMaxTicks)
            {
                run.Phase = PhaseDead;
                run.EndReason = "time";
            }
        }
    }
}
