// Seeded integer random generator (xorshift32). Port of core/rng.js.
// All arithmetic is unsigned 32-bit and wraps.
namespace Inkweight.Core
{
    public sealed class InkRng
    {
        public uint S;

        public static InkRng Create(uint seed)
        {
            unchecked
            {
                uint s = seed ^ 0x9e3779b9u;
                if (s == 0) s = 0x1234567u;
                InkRng r = new InkRng();
                r.S = s;
                // warm up so that neighbouring seeds diverge
                r.U32(); r.U32(); r.U32(); r.U32();
                return r;
            }
        }

        // Seed for a sub-stream (for example one per seat).
        public static InkRng Derive(uint seed, int index)
        {
            unchecked
            {
                return Create(seed + (uint)(index + 1) * 0x85ebca6bu);
            }
        }

        public uint U32()
        {
            unchecked
            {
                uint x = S;
                x ^= x << 13;
                x ^= x >> 17;
                x ^= x << 5;
                S = x;
                return x;
            }
        }

        // Integer in [0, n). n must be 1..65536.
        public int Int(int n)
        {
            return (int)((U32() >> 8) % (uint)n);
        }

        // Double in [0, 1) with 24 random bits (exact in binary).
        public double Float()
        {
            return (double)(U32() >> 8) / 16777216.0;
        }
    }
}
