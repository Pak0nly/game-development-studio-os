# Round 3 performance

Player build `HL-Player-assets-r3` (game commit 2c2b64d), 1920x1080, no vsync, RX 6800 XT, Ryzen 9 7900X3D, Testtal after one game minute, bench camera 20, 12 s window (`logs/run-bench.ps1`). Raw lines in `bench_*.txt`.

| Run | Dwarves drawn | Frame avg ms | Frame p95 ms | GPU ms | CPU main ms | Units CPU ms |
|---|---|---|---|---|---|---|
| Testtal alone | 9 | 5.5 | 5.6 | 5.48 | 2.90 | 0.11 |
| +150 | 159 | 9.1 | 9.2 | 9.05 | 5.11 | 1.66 |
| +300 | 309 | 12.7 | 12.8 | 12.65 | 7.04 | 3.21 |
| +300 at night (`-hlLight night`) | 309 | 12.8 | 12.8 | 12.69 | 7.23 | 3.24 |
| +300 with the old buildings (`-hlOldBuildings`) | 309 | 12.7 | 12.8 | 12.63 | 7.31 | 3.27 |

Round 2 (dwarves at 78 %): 5.6 / 8.9 / 12.4 ms. Dwarves at 100 % cost about 0.2 to 0.3 ms at 150 and 300.

A first run of the same five benches was disturbed by the core test suite running in parallel (12.6 / 16.8 / 15.1 ms, CPU-bound); it was overwritten by this clean run after the core tests had finished. A run with the previous build (same code except capture framing) gave 5.6 / 9.1 / 12.8 ms.

Build-up at the start: the hall, the 13 tablets (0 to 12 stones), the node and the 6 lanterns take about 4.0 s (`[HL-HALLART] prepared in 4080 ms`). Triangles: hall 57 766, tablet with 12 stones 7 992, road node 948, border lantern 478 (floating 592).
