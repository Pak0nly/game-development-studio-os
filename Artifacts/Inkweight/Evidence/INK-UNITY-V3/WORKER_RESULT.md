# INK-UNITY-V3 Worker Result (in progress)

verify-worker: `PASS worker receipt 54fc709217479941e763bb0ad04b0a5ba20740ee8fb5969b07c77db47b870cf2`

State 03:27 UTC: core port to version 3 done (InkPhysics.cs, InkSolo.cs, InkTuning.cs, InkGenerated.cs regenerated, CoreTests/Program.cs with version 3 tests). `dotnet run --project CoreTests` and `-c Release`: `RESULT: PASS (16722 checks, 0 failed)`, all 19 traces bit for bit (core_tests_debug.txt, core_tests_release.txt). Still open: review findings m1-m8 in the Unity layer, text truth check, stub check, README. This file is rewritten at the end.
