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
            }
        }

        // Ring: tick, ringRadius, bodies, then the bot generator state of every seat.
        public static string Ring(InkRingMatch match)
        {
            InkHash st = Create();
            st.Add(match.Tick);
            st.Add(match.RingRadius);
            AddBodies(ref st, match.World.Bodies);
            for (int i = 0; i < match.BotRng.Length; i++) st.Add(match.BotRng[i].S);
            return st.Hex();
        }

        // Solo: tick, bodies, shots (x y life), drops (x y value life), wallet,
        // score, throwCd, generator state.
        public static string Solo(InkSoloRun run)
        {
            InkHash st = Create();
            st.Add(run.Tick);
            AddBodies(ref st, run.World.Bodies);
            for (int i = 0; i < run.Shots.Count; i++)
            {
                st.Add(run.Shots[i].X); st.Add(run.Shots[i].Y); st.Add(run.Shots[i].Life);
            }
            for (int i = 0; i < run.Drops.Count; i++)
            {
                st.Add(run.Drops[i].X); st.Add(run.Drops[i].Y);
                st.Add(run.Drops[i].Value); st.Add(run.Drops[i].Life);
            }
            st.Add(run.Wallet); st.Add(run.Score); st.Add(run.ThrowCd);
            st.Add(run.Rng.S);
            return st.Hex();
        }
    }
}
