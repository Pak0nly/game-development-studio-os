[CmdletBinding(DefaultParameterSetName = 'Record')]
param(
    [Parameter(Mandatory = $true, ParameterSetName = 'Record')]
    [ValidateNotNullOrEmpty()]
    [string]$RecordPath,

    [Parameter(Mandatory = $true, ParameterSetName = 'SelfTest')]
    [switch]$SelfTest
)

Set-StrictMode -Version Latest

$AttestationPhrase = 'Requested model — not independently attested.'
$Terra = 'gpt-5.6-terra'
$Sol = 'gpt-5.6-sol'
$AllowedSolExceptions = @(
    'architecture',
    'authority_conflict',
    'novel_governance',
    'complex_root_cause',
    'contradictory_evidence',
    'high_level_design',
    'final_accountable_synthesis'
)

function Get-RecordValue {
    param([object]$Object, [string]$Name)
    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) { return $null }
    return $property.Value
}

function Test-ModelRoutingRecord {
    param([object]$Record)

    $errors = [System.Collections.Generic.List[string]]::new()
    $required = @(
        'task_id', 'output', 'primary_success_condition', 'accepted_baseline',
        'out_of_scope_temptations', 'classification', 'classification_reason',
        'requested_execution_model', 'context_fork_scope', 'escalation', 'result',
        'attestation_limitation', 'execution_records', 'final_requested_model_usage'
    )
    foreach ($name in $required) {
        $value = Get-RecordValue $Record $name
        if ($null -eq $value -or ($value -is [string] -and [string]::IsNullOrWhiteSpace($value))) {
            $errors.Add("Missing required field '$name'.")
        }
    }

    $classification = Get-RecordValue $Record 'classification'
    if ($classification -notin @('Routine', 'Standard', 'Critical')) {
        $errors.Add("classification must be Routine, Standard, or Critical.")
    }

    $requestedModel = Get-RecordValue $Record 'requested_execution_model'
    if ($requestedModel -notin @($Terra, $Sol)) {
        $errors.Add("requested_execution_model must be $Terra or $Sol.")
    }
    if ($classification -in @('Routine', 'Standard') -and $requestedModel -ne $Terra) {
        $errors.Add("$classification work must request the Terra default.")
    }

    $attestation = Get-RecordValue $Record 'attestation_limitation'
    if ($attestation -ne $AttestationPhrase) {
        $errors.Add("attestation_limitation must exactly equal '$AttestationPhrase'.")
    }

    $escalation = Get-RecordValue $Record 'escalation'
    if ($null -eq $escalation -or $null -eq (Get-RecordValue $escalation 'occurred') -or $null -eq (Get-RecordValue $escalation 'reason')) {
        $errors.Add("escalation must contain occurred and reason.")
    }

    $topSolException = Get-RecordValue $Record 'sol_exception'
    if ($requestedModel -eq $Sol -and $topSolException -notin $AllowedSolExceptions) {
        $errors.Add("A Sol request requires an allowed explicit sol_exception.")
    }
    if ($requestedModel -eq $Terra -and -not [string]::IsNullOrWhiteSpace([string]$topSolException)) {
        $errors.Add("Terra requests must not declare sol_exception.")
    }

    $records = @(Get-RecordValue $Record 'execution_records')
    if ($records.Count -eq 0) {
        $errors.Add('execution_records must contain at least one execution.')
    }
    $actualTerra = 0
    $actualSol = 0
    foreach ($execution in $records) {
        $model = Get-RecordValue $execution 'requested_execution_model'
        $taskClass = Get-RecordValue $execution 'classification'
        if ($model -notin @($Terra, $Sol)) {
            $errors.Add('Each execution record must name Terra or Sol.')
            continue
        }
        if ($taskClass -notin @('Routine', 'Standard', 'Critical')) {
            $errors.Add('Each execution record must name a valid classification.')
        }
        if ($taskClass -in @('Routine', 'Standard') -and $model -ne $Terra) {
            $errors.Add("$taskClass execution must request the Terra default.")
        }
        $exception = Get-RecordValue $execution 'sol_exception'
        if ($model -eq $Sol) {
            $actualSol++
            if ($exception -notin $AllowedSolExceptions) {
                $errors.Add('Each Sol execution requires an allowed explicit sol_exception.')
            }
        } else {
            $actualTerra++
            if (-not [string]::IsNullOrWhiteSpace([string]$exception)) {
                $errors.Add('Terra executions must not declare sol_exception.')
            }
        }
    }

    $counts = Get-RecordValue $Record 'final_requested_model_usage'
    $countTerra = Get-RecordValue $counts $Terra
    $countSol = Get-RecordValue $counts $Sol
    if ($null -eq $countTerra -or $null -eq $countSol) {
        $errors.Add('final_requested_model_usage must contain both Terra and Sol counts.')
    } else {
        if ([int]$countTerra -ne $actualTerra -or [int]$countSol -ne $actualSol) {
            $errors.Add("Final requested-model counts do not match execution_records (expected Terra=$actualTerra, Sol=$actualSol).")
        }
    }

    return $errors
}

function New-SelfTestRecord {
    param([string]$Model, [string]$Classification, [string]$SolException, [int]$TerraCount, [int]$SolCount)
    return [pscustomobject]@{
        task_id = 'MR-SELFTEST-01'
        output = 'Validation result'
        primary_success_condition = 'Record validates.'
        accepted_baseline = 'Existing routing standard; do not rebuild.'
        out_of_scope_temptations = 'No provider lock-in or silent fallback.'
        classification = $Classification
        classification_reason = 'Bounded validation.'
        requested_execution_model = $Model
        context_fork_scope = 'none'
        sol_exception = $SolException
        escalation = [pscustomobject]@{ occurred = $false; reason = 'None.' }
        result = 'Completed.'
        attestation_limitation = $AttestationPhrase
        execution_records = @([pscustomobject]@{ requested_execution_model = $Model; classification = $Classification; sol_exception = $SolException })
        final_requested_model_usage = [pscustomobject]@{ 'gpt-5.6-terra' = $TerraCount; 'gpt-5.6-sol' = $SolCount }
    }
}

function Invoke-SelfTest {
    $cases = @(
        @{ Name = 'valid Terra default'; Record = (New-SelfTestRecord $Terra 'Standard' $null 1 0); ExpectPass = $true },
        @{ Name = 'valid Sol exception'; Record = (New-SelfTestRecord $Sol 'Critical' 'architecture' 0 1); ExpectPass = $true },
        @{ Name = 'Sol without exception'; Record = (New-SelfTestRecord $Sol 'Critical' $null 0 1); ExpectPass = $false },
        @{ Name = 'incorrect final counts'; Record = (New-SelfTestRecord $Terra 'Routine' $null 0 1); ExpectPass = $false }
    )
    $failed = $false
    foreach ($case in $cases) {
        $errors = @(Test-ModelRoutingRecord $case.Record)
        $passed = $errors.Count -eq 0
        if ($passed -eq $case.ExpectPass) {
            Write-Output "PASS: $($case.Name)"
        } else {
            $failed = $true
            Write-Output "FAIL: $($case.Name)"
            $errors | ForEach-Object { Write-Output "  $_" }
        }
    }
    if ($failed) { exit 1 }
    Write-Output 'SELF-TEST PASS'
}

if ($SelfTest) {
    Invoke-SelfTest
    exit 0
}

try {
    $record = Get-Content -Raw -LiteralPath $RecordPath | ConvertFrom-Json
} catch {
    Write-Error "Could not read JSON record: $($_.Exception.Message)"
    exit 2
}

$validationErrors = @(Test-ModelRoutingRecord $record)
if ($validationErrors.Count -gt 0) {
    $validationErrors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output 'VALID: Model routing record passed.'
