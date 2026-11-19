// Tiny JSON reader for the tuning file and the golden files. No engine and no
// package dependency. Objects become Dictionary<string, object>, arrays
// List<object>, numbers double, strings string, true/false bool, null null.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Inkweight.Core
{
    public static class InkJson
    {
        public static object Parse(string text)
        {
            int pos = 0;
            // skip a byte order mark if a file was read with one
            if (text.Length > 0 && text[0] == '﻿') pos = 1;
            object v = ReadValue(text, ref pos);
            SkipWs(text, ref pos);
            if (pos != text.Length) throw new FormatException("JSON: unexpected text at " + pos);
            return v;
        }

        public static Dictionary<string, object> Obj(object o)
        {
            Dictionary<string, object> d = o as Dictionary<string, object>;
            if (d == null) throw new FormatException("JSON: object expected");
            return d;
        }

        public static List<object> Arr(object o)
        {
            List<object> a = o as List<object>;
            if (a == null) throw new FormatException("JSON: array expected");
            return a;
        }

        public static double Num(object o)
        {
            if (!(o is double)) throw new FormatException("JSON: number expected");
            return (double)o;
        }

        public static string Str(object o)
        {
            string s = o as string;
            if (s == null) throw new FormatException("JSON: string expected");
            return s;
        }

        public static object Get(object o, string key)
        {
            object v;
            if (!Obj(o).TryGetValue(key, out v)) throw new FormatException("JSON: missing key " + key);
            return v;
        }

        public static double[] NumArray(object o)
        {
            List<object> a = Arr(o);
            double[] r = new double[a.Count];
            for (int i = 0; i < r.Length; i++) r[i] = Num(a[i]);
            return r;
        }

        public static string[] StrArray(object o)
        {
            List<object> a = Arr(o);
            string[] r = new string[a.Count];
            for (int i = 0; i < r.Length; i++) r[i] = Str(a[i]);
            return r;
        }

        private static void SkipWs(string t, ref int pos)
        {
            while (pos < t.Length)
            {
                char c = t[pos];
                if (c == ' ' || c == '\n' || c == '\r' || c == '\t') pos++;
                else break;
            }
        }

        private static object ReadValue(string t, ref int pos)
        {
            SkipWs(t, ref pos);
            if (pos >= t.Length) throw new FormatException("JSON: unexpected end");
            char c = t[pos];
            if (c == '{')
            {
                pos++;
                Dictionary<string, object> d = new Dictionary<string, object>();
                SkipWs(t, ref pos);
                if (pos < t.Length && t[pos] == '}') { pos++; return d; }
                for (;;)
                {
                    SkipWs(t, ref pos);
                    string key = ReadString(t, ref pos);
                    SkipWs(t, ref pos);
                    Expect(t, ref pos, ':');
                    d[key] = ReadValue(t, ref pos);
                    SkipWs(t, ref pos);
                    if (pos < t.Length && t[pos] == ',') { pos++; continue; }
                    Expect(t, ref pos, '}');
                    return d;
                }
            }
            if (c == '[')
            {
                pos++;
                List<object> a = new List<object>();
                SkipWs(t, ref pos);
                if (pos < t.Length && t[pos] == ']') { pos++; return a; }
                for (;;)
                {
                    a.Add(ReadValue(t, ref pos));
                    SkipWs(t, ref pos);
                    if (pos < t.Length && t[pos] == ',') { pos++; continue; }
                    Expect(t, ref pos, ']');
                    return a;
                }
            }
            if (c == '"') return ReadString(t, ref pos);
            if (Match(t, pos, "true")) { pos += 4; return true; }
            if (Match(t, pos, "false")) { pos += 5; return false; }
            if (Match(t, pos, "null")) { pos += 4; return null; }
            int start = pos;
            while (pos < t.Length)
            {
                char n = t[pos];
                if ((n >= '0' && n <= '9') || n == '-' || n == '+' || n == '.' || n == 'e' || n == 'E') pos++;
                else break;
            }
            if (pos == start) throw new FormatException("JSON: unexpected character at " + pos);
            return double.Parse(t.Substring(start, pos - start), NumberStyles.Float, CultureInfo.InvariantCulture);
        }

        private static bool Match(string t, int pos, string word)
        {
            return string.CompareOrdinal(t, pos, word, 0, word.Length) == 0;
        }

        private static void Expect(string t, ref int pos, char c)
        {
            if (pos >= t.Length || t[pos] != c) throw new FormatException("JSON: expected '" + c + "' at " + pos);
            pos++;
        }

        private static string ReadString(string t, ref int pos)
        {
            Expect(t, ref pos, '"');
            StringBuilder sb = new StringBuilder();
            for (;;)
            {
                if (pos >= t.Length) throw new FormatException("JSON: open string");
                char c = t[pos++];
                if (c == '"') return sb.ToString();
                if (c != '\\') { sb.Append(c); continue; }
                if (pos >= t.Length) throw new FormatException("JSON: open escape");
                char e = t[pos++];
                switch (e)
                {
                    case 'n': sb.Append('\n'); break;
                    case 't': sb.Append('\t'); break;
                    case 'r': sb.Append('\r'); break;
                    case 'b': sb.Append('\b'); break;
                    case 'f': sb.Append('\f'); break;
                    case 'u':
                        if (pos + 4 > t.Length) throw new FormatException("JSON: bad unicode escape");
                        sb.Append((char)int.Parse(t.Substring(pos, 4), NumberStyles.HexNumber, CultureInfo.InvariantCulture));
                        pos += 4;
                        break;
                    default: sb.Append(e); break; // \" \\ \/
                }
            }
        }
    }
}
