# HL-ANIM-EXAM-STAGE1-V1 launcher: the exam in Unity batch mode on the Zwerge folder, hidden, no graphics device.
# usage: pwsh -File run_exam.ps1 <run name>
param([string]$Name = "run")
$ev = "C:/Users/jarid/Desktop/Game Development/Artifacts/Hearthlands/Evidence/HL-ANIM-EXAM-STAGE1-V1"
$unity = "C:/Program Files/Unity/Hub/Editor/6000.6.4f1/Editor/Unity.exe"
$a = @("-batchmode", "-nographics", "-projectPath", "C:/GameDev/Hearthlands-Zwerge/Unity", "-executeMethod", "Hearthlands.LookTest.AnimExam.AeExam.RunBatch", "-out", "`"$ev`"", "-logFile", "`"$ev/logs/unity_$Name.log`"")
$p = Start-Process -FilePath $unity -ArgumentList $a -WindowStyle Hidden -PassThru -Wait
"exit $($p.ExitCode)"