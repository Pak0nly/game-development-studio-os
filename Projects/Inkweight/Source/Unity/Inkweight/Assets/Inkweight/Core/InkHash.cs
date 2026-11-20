// State hash for bit-exact comparison between implementations. Port of
// core/hash.js: FNV-1a (32 bit) over the 8 little-endian IEEE-754 bytes of
// every value. Integers and flags are hashed as doubles too.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public struct InkHash
    {
        public uint H;

        public static InkHash Create()
        {
            InkHash st;
            st.H = 0x811c9dc5u;
            return st;
        }

        public void Add(double value)
        {
            unchecked
            {
                // The shifts walk from the lowest byte up, which is the
                // little-endian byte order on every machine.
                ulong bits = (ulong)BitConverter.DoubleToInt64Bits(value);
                uint h = H;
                for (int i = 0; i < 8; i++)
                {
                    h ^= (uint)((bits >> (8 * i)) & 0xffUL);
                    h *= 0x01000193u;
                }
                H = h;
            }
        }

        public string Hex()
        {
            const string digits = "0123456789abcdef";
            char[] c = new char[8];
            uint h = H;
            for (int i = 7; i >= 0; i--)
            {
                c[i] = digits[(int)(h & 0xfu)];
                h >>= 4;
            }
            return new string(c);
        }

        private static void AddBodies(ref InkHash st, List<InkBody> bodies)
        {
            for (int i = 0; i < bodies.Count; i++)
            {
                InkBody b = bodies[i];
                st.Add(b.X); st.Add(b.Y);
                st.Add(b.Vx); st.Add(b.Vy);
                st.Add(b.Fx); st.Add(b.Fy);
                st.Add(b.Hp);
                st.Add(b.Alive ? 1 : 0);
                st.Add(b.DashTicks); st.Add(b.DashCd);
                st.Add(b.DashDx); st.Add(b.DashDy);
            }
        }

        private static void AddCooldowns(ref InkHash st, InkWorld world)
        {
            for (int i = 0; i < world.Cd.Length; i++) st.Add(world.Cd[i]);
        }

        // Ring (layout 2): round, tick, ringRadius, bodies, all hit cooldowns,
        // then per seat: bot generator state, bot wobble, bot style.
        public static string Ring(InkRingMatch match)
        {
            InkHash st = Create();
            st.Add(match.Round);
            st.Add(match.Tick);
            st.Add(match.RingRadius);
            AddBodies(ref st, match.World.Bodies);
            AddCooldowns(ref st, match.World);
            for (int i = 0; i < match.SeatCount; i++)
            {
                st.Add(match.BotRng[i].S);
                st.Add(match.BotWobble[i]);
                st.Add(match.BotStyle[i]);
            }
            return st.Hex();
        }

        // Solo (layout 2): wave, tick, bodies, all hit cooldowns, shots (x y
        // ux uy speed life), drops (x y value life), wallet, score, throwCd,
        // generator state, then heroBudget, weaponBudget, colours 1..4,
        // upgradeTaken, copies, stake index, dropValue, heroMaxHp.
        public static string Solo(InkSoloRun run)
        {
            InkHash st = Create();
            st.Add(run.Wave);
            st.Add(run.Tick);
            AddBodies(ref st, run.World.Bodies);
            AddCooldowns(ref st, run.World);
            for (int i = 0; i < run.Shots.Count; i++)
            {
                st.Add(run.Shots[i].X); st.Add(run.Shots[i].Y);
                st.Add(run.Shots[i].Ux); st.Add(run.Shots[i].Uy); st.Add(run.Shots[i].Speed);
                st.Add(run.Shots[i].Life);
            }
            for (int i = 0; i < run.Drops.Count; i++)
            {
                st.Add(run.Drops[i].X); st.Add(run.Drops[i].Y);
                st.Add(run.Drops[i].Value); st.Add(run.Drops[i].Life);
            }
            st.Add(run.Wallet); st.Add(run.Score); st.Add(run.ThrowCd);
            st.Add(run.Rng.S);
            st.Add(run.HeroBudget); st.Add(run.WeaponBudget);
            for (int c = 1; c <= 4; c++) st.Add(run.Colours[c] ? 1 : 0);
            st.Add(run.UpgradeTaken ? 1 : 0);
            st.Add(run.Copies); st.Add(run.StakeIndex); st.Add(run.DropValue);
            st.Add(run.HeroMaxHp);
            return st.Hex();
        }
    }
}
