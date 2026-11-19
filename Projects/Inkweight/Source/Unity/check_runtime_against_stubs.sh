#!/usr/bin/env bash
# Compiles the Unity Runtime sources against the hand-written engine stubs in
# all four input variants and runs the headless smoke test in each.
# This is NOT a Unity build: it proves syntax, core API usage and the game's
# own control flow, nothing about real engine behaviour.
set -u
cd "$(dirname "$0")"
export DOTNET_NOLOGO=1 DOTNET_CLI_TELEMETRY_OPTOUT=1
status=0
for variant in Legacy InputSystem Both None; do
  echo "== input variant: $variant"
  rm -f "EngineStubs/bin/$variant/Inkweight.RuntimeStubCheck.dll"
  dotnet build EngineStubs/RuntimeStubCheck.csproj -p:InkInput=$variant -v:q --nologo 2>&1 | grep -E "error|Warn|Build succeeded" | sort -u
  if [ "${PIPESTATUS[0]}" -ne 0 ]; then echo "BUILD FAILED for $variant"; status=1; continue; fi
  if ! dotnet "EngineStubs/bin/$variant/Inkweight.RuntimeStubCheck.dll"; then status=1; fi
done
if [ $status -eq 0 ]; then echo "STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)"; else echo "STUB CHECK: FAIL"; fi
exit $status
