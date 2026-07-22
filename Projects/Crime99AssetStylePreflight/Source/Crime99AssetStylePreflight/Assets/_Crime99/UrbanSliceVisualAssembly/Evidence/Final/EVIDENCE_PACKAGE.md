# Crime99 Urban Slice StylePreflight — Formal Evidence Package

## Candidate identity

This package freezes the unchanged Terra #79 formative candidate by hash. It does not freeze or alter Vendor content and does not claim final production or release readiness.

- Scene: Assets/_Crime99/UrbanSliceVisualAssembly/Scenes/C99_UrbanSlice_VisualAssembly.unity
- Scene SHA-256: 921FDE22A4CBCC2D05D2FD82208107E6FF8B3FA1CE6894C3E45E9256C3A8ACC8
- Placement manifest SHA-256: CC3B6CFFFCC04D593FC7496D9DA802074050FF1DCB90F399E661606D32D7E87B
- Original #79 builder SHA-256: DC03BFCB0F1EB08F1323B8542E1314680C0F506F753A0FE1D58E046AE644070D
- Image-payload aggregate: 60E3D4A53FDAA3EF8E1584A0F6DBB8029E2841364DC1912CE44C41A648C7C68F
- Requested model: gpt-5.6-terra — Requested model, not independently attested.

The builder was subsequently changed only to add a capture-only entry point. That method verified the scene hash before and after opening it, created two temporary cameras, rendered two PNGs, destroyed the cameras, and never saved the scene or an asset. The candidate scene hash remained exact.

## Formative result

- Street identity is immediately readable.
- Both sidewalks are visible and continuous.
- Seven unique complete Vendor buildings form eight frontage placements.
- Prefab-native commercial doors and storefront glazing face the street.
- SM_NYCB_38 presents a road-facing garage/service facade.
- SM_NYCB_36 provides the narrow vertical north landmark.
- Geometry validation found zero building overlaps, zero sidewalk intrusions, and ground contact within 0.02 m.
- Material validation covered 451 assigned Vendor material slots: zero missing slots, zero error shaders, and zero magenta-like pixels.

Broad spacing, the neutral horizon, dark brick concentration, and repeated fire-escape language remain later assembly/dressing concerns.

## Placement summary

| Instance | Prefab | Slot Z | Road face | Yaw | Scale | Bounds size XYZ |
| --- | --- | ---: | --- | ---: | ---: | --- |
| West_SM5 | SM_NYCB_5.prefab | -21.0 | maxX = -8.30 | -90 | 0.82 | 7.7225 × 8.6947 × 15.1619 |
| West_SM24 | SM_NYCB_24.prefab | -6.0 | maxX = -8.30 | -90 | 0.82 | 10.8223 × 16.0687 × 13.2812 |
| West_SM17 | SM_NYCB_17.prefab | 8.3 | maxX = -8.30 | -90 | 0.82 | 8.5134 × 15.4168 × 12.6959 |
| West_Landmark_SM36 | SM_NYCB_36.prefab | 28.0 | maxX = -8.30 | -90 | 1.00 | 9.4787 × 20.6034 × 9.4806 |
| East_SM2 | SM_NYCB_2.prefab | -21.0 | minX = 8.30 | 90 | 0.82 | 9.9543 × 15.0141 × 12.9734 |
| East_SM17 | SM_NYCB_17.prefab | -7.0 | minX = 8.30 | 90 | 0.82 | 8.5134 × 15.4168 × 12.6959 |
| East_SM25 | SM_NYCB_25.prefab | 8.5 | minX = 8.30 | 90 | 0.82 | 9.4683 × 13.8594 × 12.2785 |
| East_Service_SM38 | SM_NYCB_38.prefab | 28.0 | minX = 8.30 | 90 | 0.82 | 10.1082 × 6.2718 × 9.0607 |

EvidenceManifest.json contains the exact serialized root positions, bounds centers, full prefab paths, camera ledger, material-slot counts, protection hashes, and per-file hashes.

## Proxy inventory

Only five project-owned primitives remain:

1. Road at (0, -0.16, 3), scale (9.5, 0.3, 78).
2. West sidewalk at (-6.6, -0.06, 3), scale (3.5, 0.16, 78).
3. East sidewalk at (6.6, -0.06, 3), scale (3.5, 0.16, 78).
4. West curb at (-4.83, 0.03, 3), scale (0.18, 0.22, 78).
5. East curb at (4.83, 0.03, 3), scale (0.18, 0.22, 78).

There are no entrance, service-storytelling, gameplay, micro-detail, prop, or dressing proxies.

## Asset and repetition assessment

SM_NYCB_36 was selected over SM_NYCB_8 because its 9.48 m frontage fits the frozen north slot while retaining 20.60 m height. SM_NYCB_8 would nearly double the frontage and flatten the hierarchy. SM_NYCB_25 was rejected for service use, and SM_NYCB_38 was retained specifically for its low utility reading.

SM_NYCB_17 appears on both sides with mirrored yaw. This single repeat across eight placements is acceptable for formative assembly, but its dark brick and fire-escape language should be evaluated during later asset substitution or dressing. Blue awnings, red storefront bands, bright rooftop details, and repeated fire escapes are period/art-direction risks. They remain untouched Vendor content.

## Comparison index

| Candidate | Approved Recovery-B reference | Purpose |
| --- | --- | --- |
| C99_VisualAssembly_overview.png | References/C99_USS1_Recovery_B_E01_SouthGameplayLike_Unlabelled.png | Street, sidewalks, hierarchy |
| C99_VisualAssembly_service.png | References/C99_USS1_Recovery_B_E02_ServiceLoading_Unlabelled.png | East service reservation/function |
| C99_VisualAssembly_west.png | References/C99_USS1_Recovery_B_E03_FrontageRelationship_Unlabelled.png | West frontage/public face |
| C99_VisualAssembly_east.png | References/C99_USS1_Recovery_B_E03_FrontageRelationship_Unlabelled.png | East frontage/sidewalk |
| C99_VisualAssembly_entrance.png | References/C99_USS1_Recovery_B_E03_FrontageRelationship_Unlabelled.png | Real-prefab entrance readability |
| C99_VisualAssembly_placement_map.png | none | Documentary footprint map |

The three references are byte-identical documentary copies from the authoritative Sprint-1 Recovery-B checkpoint. They are not imported scene content and carry no authority to modify the current candidate.

## Scope boundary

This package records an immutable formative candidate. It does not perform formal specialist reviews, approve final art direction, authorize another correction, mutate Vendor files, or stage, commit, or push repository content.
