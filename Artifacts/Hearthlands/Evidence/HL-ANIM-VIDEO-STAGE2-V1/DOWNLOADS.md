# HL-ANIM-VIDEO-STAGE2-V1 downloads

All files lie in `C:/GameDev/AnimTools` (outside every repository). Downloaded 2026-11-08 between 19:52 and 20:00. No account, no paid service.

## Models (Hugging Face, published sha256 = Git LFS oid, checked: equal)

| File | Source URL | Size (bytes) | sha256 | Licence (read) |
|---|---|---|---|---|
| wan2.2_ti2v_5B_fp16.safetensors | https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors (the repository now redirects to Comfy-Org/Wan-2.2, same organisation) | 9999658848 | 456f901338bd9eadbded3828b819109a9b68e8a525ca5cf8d0049a69fcfeca1e | Apache 2.0 (model card licence field) |
| wan2.2_vae.safetensors | https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files/vae/wan2.2_vae.safetensors | 1409400960 | e40321bd36b9709991dae2530eb4ac303dd168276980d3e9bc4b6e2b75fed156 | Apache 2.0 |
| umt5_xxl_fp8_e4m3fn_scaled.safetensors | https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors (redirects to Comfy-Org/Wan-2.1) | 6735906897 | c3355d30191f1f066b26d93fba017ae9809dce6c627dda5f6a66eaa651204f68 | Apache 2.0 |
| dinov2_vits14_pretrain.pth | https://dl.fbaipublicfiles.com/dinov2/dinov2_vits14/dinov2_vits14_pretrain.pth (the official link in github.com/facebookresearch/dinov2 README; no published checksum) | 88283115 | b938bf1bc15cd2ec0feacfe3a1bb553fe8ea9ca46a7e1d8d00217f29aef60cd9 | Apache 2.0 (LICENSE in the repository) |

## Program code (git, shallow)

| What | Source | Commit | Licence (read) |
|---|---|---|---|
| comfyui-rocm, tag 101026 | https://github.com/patientx-cfz/comfyui-rocm | a07b841966cb699caed490ff3d1e2935e911dd56 | GPL-3.0 (LICENSE) |
| DINOv2 model code | https://github.com/facebookresearch/dinov2 | 7764ea0f912e53c92e82eb78a2a1631e92725fc8 | Apache 2.0 (LICENSE) |

Not used from comfyui-rocm: its `install.bat` (it would also fetch Python 3.12, get-pip, ComfyUI-Manager, five custom node packs, diffusers, triton-windows, sage-attention, bitsandbytes and flash-attention from third-party releases: not approved, not needed). Visual Studio Build Tools: not needed, not installed. ComfyUI's text encoder tokenizer files come with the ComfyUI code.

## Python packages (own environment `C:/GameDev/AnimTools/venv`, made from the existing Python 3.10.11; system Python, PATH and other programs unchanged)

Installed offline from these saved files. One extra file, `torch-2.14.1-cp310-cp310-win_amd64.whl` (CPU-only PyTorch from pypi.org, pulled in by pip's resolver for `torchsde`), was deleted unused before installing; it was never installed. Licences: PyTorch BSD-3; AMD ROCm packages AMD terms (MIT-style licence files in the wheels); NumPy, SciPy BSD-3; OpenCV Apache 2.0; ComfyUI's own packages GPL-3.0; the rest of ComfyUI's dependencies permissive (MIT, BSD, Apache 2.0, as stated in their package metadata).

| Group | Source | File | Size (bytes) | sha256 |
|---|---|---|---|---|
| wheels_torch | AMD index | amd_torch_device_gfx1030-2.14.0+rocm10.1.0-cp310-cp310-win_amd64.whl | 43820525 | e247a29ed5c70896570d4b621fda5175343ea063075da14512d43b59215cb7ec |
| wheels_torch | AMD index | amd_torchvision_device_gfx1030-0.29.0a0+rocm10.1.0-cp310-cp310-win_amd64.whl | 118846 | 1771bbb420107a6bf87ba823571b78bfbccf6f48a24421ba08350e80d0aa81f9 |
| wheels_torch | AMD index | filelock-4.0.8-py3-none-any.whl | 109665 | 325ff22f358c18443b1fcdfa0a7aa3faec4b500c2807c554719da4567b533d31 |
| wheels_torch | AMD index | fsspec-2026.9.0-py3-none-any.whl | 221738 | 8dd6e646e99ea382bd85f97a45e6b526a442d79423a7dc673f1e2756d05fcb5f |
| wheels_torch | AMD index | jinja2-3.1.6-py3-none-any.whl | 134899 | 85ece4451f492d0c13c5dd7c13a64681a86afae63a5f347908daf103ce6d2f67 |
| wheels_torch | AMD index | markupsafe-3.0.3-cp310-cp310-win_amd64.whl | 15056 | c4ffb7ebf07cfe8931028e3e4c85f0357459a3f9f9490886198848f4fa002ec8 |
| wheels_torch | AMD index | mpmath-1.3.0-py3-none-any.whl | 536198 | a0b2b9fe80bbcd81a6647ff13108738cfb482d481d826cc0e02f5b35e5c88d2c |
| wheels_torch | AMD index | networkx-3.4.2-py3-none-any.whl | 1723263 | df5d4365b724cf81b8c6a7312509d0c22386097011ad1abe274afd5e9d3bbc5f |
| wheels_torch | AMD index | numpy-2.2.6-cp310-cp310-win_amd64.whl | 12904620 | f0fd6321b839904e15c46e0d257fdd101dd7f530fe03fd6359c1ea63738703f3 |
| wheels_torch | AMD index | pillow-12.3.0-cp310-cp310-win_amd64.whl | 7226887 | 300557495eb45ebb8aec96c2da9c4be642fbf7cd937278b4013ba894ea8eb0eb |
| wheels_torch | AMD index | rocm-10.1.0.tar.gz | 27536 | e6616e62ebd1324031681e6e59349d46ee4f143a8d8f4f901a91c35c993041fc |
| wheels_torch | AMD index | rocm_bootstrap-0.3.0-py3-none-any.whl | 30532 | 62d0160ecdd86f7132dbab9aec257cb2c96327df2592b0633aa6bb56399cc095 |
| wheels_torch | AMD index | rocm_sdk_core-10.1.0-py3-none-win_amd64.whl | 776978384 | b12f1c4cde14ed1cd8864006d17586c6b1e6a4e4695b9597cfe04ed7715e952f |
| wheels_torch | AMD index | rocm_sdk_device_gfx1030-10.1.0-py3-none-win_amd64.whl | 55388018 | f7c850ae8f17de48d9df65ada67eba09cfa75c78a602e81b518398b7b1f0ff0c |
| wheels_torch | AMD index | rocm_sdk_libraries-10.1.0-py3-none-win_amd64.whl | 118645973 | 0c34bafbb4aa626cc710d8b130bb314f591194c3d79eeb5892b755ea0be06159 |
| wheels_torch | AMD index | setuptools-81.0.0-py3-none-any.whl | 1062021 | fdd925d5c5d9f62e4b74b30d6dd7828ce236fd6ed998a08d81de62ce5a6310d6 |
| wheels_torch | AMD index | sympy-1.14.0-py3-none-any.whl | 6299353 | e091cc3e99d2141a0ba2847328f5479b05d94a6635cb96148ccb3f34671bd8f5 |
| wheels_torch | AMD index | torch-2.14.0+rocm10.1.0-cp310-cp310-win_amd64.whl | 115519400 | e4a02819acb3d8c0c8fa789ce873eb20239136ec2d64e3d8a6a3b0916bdaa2dc |
| wheels_torch | AMD index | torchvision-0.29.0a0+rocm10.1.0-cp310-cp310-win_amd64.whl | 944908 | 133bf62575df153cd2da2dbb1ea1c262a9c1f3652ccd9d63870901da45cdac7c |
| wheels_torch | AMD index | typing_extensions-4.16.0-py3-none-any.whl | 45571 | 481caa481374e813c1b176ada14e97f1f67a4539ce9cfeb3f350d78d6370c2e8 |
| wheels_comfy | pypi.org | aiohappyeyeballs-2.7.1-py3-none-any.whl | 15038 | 9243213661e29250eb41368e5daa826fc017156c3b8a11440826b2e3ed376472 |
| wheels_comfy | pypi.org | aiohttp-3.14.5-cp310-cp310-win_amd64.whl | 512021 | bea559ad70218d230663e4210875735076a9bfea5994cef34a55a25faeaf2544 |
| wheels_comfy | pypi.org | aiosignal-1.4.0-py3-none-any.whl | 7490 | 053243f8b92b990551949e63930a839ff0cf0b0ebbe0597b0f3fb19e1a0fe82e |
| wheels_comfy | pypi.org | alembic-1.20.1-py3-none-any.whl | 270355 | 9970712cfb81ea26c8658d378aaa5b8f6ff9146e5bb111d70497c164016cf598 |
| wheels_comfy | pypi.org | annotated_doc-0.0.5-py3-none-any.whl | 5302 | 117bac03a25ede5df5440e855b32d556049ca169ead221505badf432fed4b101 |
| wheels_comfy | pypi.org | anyio-4.16.0-py3-none-any.whl | 134521 | c66ae634e0b8228396b801741beb3294326d4b6102f7bba4041c0dfb58c29026 |
| wheels_comfy | pypi.org | async_timeout-5.0.1-py3-none-any.whl | 6233 | 39e3809566ff85354557ec2398b55e096c8364bacac9405a7a1fa429e77fe76c |
| wheels_comfy | pypi.org | attrs-26.1.0-py3-none-any.whl | 67548 | c647aa4a12dfbad9333ca4e71fe62ddc36f4e63b2d260a37a8b83d2f043ac309 |
| wheels_comfy | pypi.org | av-17.1.0-cp310-cp310-win_amd64.whl | 28126516 | 3453b06075c7bb973fdb6de52563f7692ff05cbc64c0bb45f4fd6e8709131f2f |
| wheels_comfy | pypi.org | blake3-1.0.10-cp310-cp310-win_amd64.whl | 220299 | 886393702a20a3a8cb96be37e23b27529981dd05f53477dd2ce84bf0e736f07b |
| wheels_comfy | pypi.org | certifi-2026.10.23-py3-none-any.whl | 135082 | e9b54de76e530bb6cf0ccd036787103acb58fd42ba930ea8bf948ddbaa2f61d1 |
| wheels_comfy | pypi.org | cffi-2.1.1-cp310-cp310-win_amd64.whl | 185082 | a48d62ab9d6f4f98c983223a547af44be6ca3691074c31cecced6facd3ba2dc1 |
| wheels_comfy | pypi.org | charset_normalizer-3.5.2-cp310-cp310-win_amd64.whl | 215446 | 1461ac396c4fdb983a675f20aa555624f0ee18ac83d832b9244ffff3d8055275 |
| wheels_comfy | pypi.org | click-8.5.1-py3-none-any.whl | 126163 | 8bb5376d2006950386f8c6427613334a2acadc5f559cb80e638d00b4df957e37 |
| wheels_comfy | pypi.org | colorama-0.4.6-py2.py3-none-any.whl | 25335 | 4f1d9991f5acc0ca119f9d443620b77f9d6b33703e51011c16baf57afb285fc6 |
| wheels_comfy | pypi.org | comfy_aimdo-0.5.6-cp39-abi3-win_amd64.whl | 280910 | a323be8befb312398565627a7dc59ec9c8ac7ed1f2e106c9317dfa0f6e718a03 |
| wheels_comfy | pypi.org | comfy_kitchen-0.2.37-cp310-cp310-win_amd64.whl | 48757611 | 4426b19ac653254f72f45fac0bca1618d45f37622c11bd93a236fd7236dbbb76 |
| wheels_comfy | pypi.org | comfyui_embedded_docs-0.5.13-py3-none-any.whl | 19872156 | 10d8be868f3bb64edf0b6238ec2f0967ad2b6d3f5e08c970f95180d1c0c34690 |
| wheels_comfy | pypi.org | comfyui_frontend_package-1.55.14-py3-none-any.whl | 25496533 | 7874c5a5d16877632a3d525bbfbc0fa04d9388e32f0478e69130f092b5bbff82 |
| wheels_comfy | pypi.org | comfyui_workflow_templates-0.11.78-py3-none-any.whl | 10876 | 2f583e15f6b6d1072e6e3e63f93bd2357fe6fa8357a03180abbeac64926d69cf |
| wheels_comfy | pypi.org | comfyui_workflow_templates_core-0.3.369-py3-none-any.whl | 80628 | 31332ed161d26a5ea6588da990385b9709bacf18643f3a68d9a9c875be531669 |
| wheels_comfy | pypi.org | comfyui_workflow_templates_json-0.1.104-py3-none-any.whl | 3831750 | 58fd942c2b79327688dd4c57c859b36c8f7d8ace591b8ea4cd71766841c4b00e |
| wheels_comfy | pypi.org | comfyui_workflow_templates_media_api-0.3.84-py3-none-any.whl | 100148800 | c2d6a5999ac39e4f37f47ae231c92557defe5addb2cc6ab5c11410b4d5a2910a |
| wheels_comfy | pypi.org | comfyui_workflow_templates_media_assets_01-0.1.48-py3-none-any.whl | 94172110 | 7733ed12867e95e6b8b39be20bcc73579c28e97e5a44086ffb977cc2c1c78c43 |
| wheels_comfy | pypi.org | comfyui_workflow_templates_media_assets_02-0.1.11-py3-none-any.whl | 27442195 | d8b01251ae0ad721d79b647afa0c1ac4ab6b4758a428f243829ff994f9078186 |
| wheels_comfy | pypi.org | comfyui_workflow_templates_media_image-0.3.160-py3-none-any.whl | 89401690 | d4a5c5541c7088f6adb1c7da41f5d7c1c14a037eda6a61cd8b4b76c251faaa93 |
| wheels_comfy | pypi.org | comfyui_workflow_templates_media_other-0.3.229-py3-none-any.whl | 89097925 | ce3d98fa9d84b914c335fe5c9bc903cfefbe1932b1bc3cb6baef7f371b4bd435 |
| wheels_comfy | pypi.org | comfyui_workflow_templates_media_video-0.3.101-py3-none-any.whl | 104342671 | 6270fd61c8c3931b6f0031abac7d4c90ced624de6c7918bff85b89e6c3d7493c |
| wheels_comfy | pypi.org | cryptography-50.0.2-cp39-abi3-win_amd64.whl | 3854095 | 4e81d95e5bafc2d6e34e4bed780e53e4d5b9a2f928573428aa4d35fbec1eb0de |
| wheels_comfy | pypi.org | einops-0.8.2-py3-none-any.whl | 65638 | 54058201ac7087911181bfec4af6091bb59380360f069276601256a76af08193 |
| wheels_comfy | pypi.org | exceptiongroup-1.3.1-py3-none-any.whl | 16740 | a7a39a3bd276781e98394987d3a5701d0c4edffb633bb7a5144577f82c773598 |
| wheels_comfy | pypi.org | filelock-4.1.0-py3-none-any.whl | 133003 | 2ce9818e3e2d8f284c1a964414447ef148d42a5fd5e2a477a7118e574b293ec1 |
| wheels_comfy | pypi.org | frozenlist-1.8.0-cp310-cp310-win_amd64.whl | 43837 | 667c3777ca571e5dbeb76f331562ff98b957431df140b54c85fd4d52eea8d8f6 |
| wheels_comfy | pypi.org | fsspec-2026.9.0-py3-none-any.whl | 221738 | 8dd6e646e99ea382bd85f97a45e6b526a442d79423a7dc673f1e2756d05fcb5f |
| wheels_comfy | pypi.org | greenlet-3.5.6-cp310-cp310-win_amd64.whl | 322896 | dad3d233d441a022c1f7155f0fb9d5aff7b97c1ea8c7dfa02cce586b16ab2d0b |
| wheels_comfy | pypi.org | h11-0.16.0-py3-none-any.whl | 37515 | 63cf8bbe7522de3bf65932fda1d9c2772064ffb3dae62d55932da54b31cb6c86 |
| wheels_comfy | pypi.org | hf_xet-1.8.0-cp38-abi3-win_amd64.whl | 3911559 | 92188598dedc1e1f5609bd718d4db8687a6c89915553912571e2f587892eecec |
| wheels_comfy | pypi.org | httpcore2-2.14.0-py3-none-any.whl | 84291 | 4c4f64f4b544afeb778c42c0ffb5941b29e671157e90ed3f6dc787c4bca90cd1 |
| wheels_comfy | pypi.org | httpx2-2.14.0-py3-none-any.whl | 96901 | 9d20c13a10bae1773a0be3b0f1e5beeb4bdd549bc3a2ba18efa32897c65403e4 |
| wheels_comfy | pypi.org | huggingface_hub-2.4.0-py3-none-any.whl | 857021 | 42ecfd93ede47bdd333daebbf66a32d7bfe2e18752754fe4d2d4f98a0179d801 |
| wheels_comfy | pypi.org | idna-3.20-py3-none-any.whl | 69583 | ab7ae7122974553370f0bdb919e1a960b2cd1bc1ef0276416d896db81c14582c |
| wheels_comfy | pypi.org | jinja2-3.1.6-py3-none-any.whl | 134899 | 85ece4451f492d0c13c5dd7c13a64681a86afae63a5f347908daf103ce6d2f67 |
| wheels_comfy | pypi.org | mako-1.4.3-py3-none-any.whl | 80164 | 723296007c870bfd6b3f0c3230dba7198096e5269297ebf5e4eff9e7ffa39d4f |
| wheels_comfy | pypi.org | markdown_it_py-4.2.0-py3-none-any.whl | 91687 | 9f7ebbcd14fe59494226453aed97c1070d83f8d24b6fc3a3bcf9a38092641c4a |
| wheels_comfy | pypi.org | markupsafe-3.0.4-cp310-cp310-win_amd64.whl | 14329 | 5c22873ad1f0532ba40fa1727f3c0fc1bbbaab6d373d4cbe3f0dc74b2e2521c7 |
| wheels_comfy | pypi.org | mdurl-0.1.2-py3-none-any.whl | 9979 | 84008a41e51615a49fc9966191ff91509e3c40b939176e643fd50a5c2196b8f8 |
| wheels_comfy | pypi.org | mpmath-1.3.0-py3-none-any.whl | 536198 | a0b2b9fe80bbcd81a6647ff13108738cfb482d481d826cc0e02f5b35e5c88d2c |
| wheels_comfy | pypi.org | multidict-7.1.0-cp310-cp310-win_amd64.whl | 92126 | 36b14886aa3e0b8786ecdaa196374422c7b1c1dcc8764d02b2409f74d47914bc |
| wheels_comfy | pypi.org | networkx-3.4.2-py3-none-any.whl | 1723263 | df5d4365b724cf81b8c6a7312509d0c22386097011ad1abe274afd5e9d3bbc5f |
| wheels_comfy | pypi.org | numpy-2.2.6-cp310-cp310-win_amd64.whl | 12904620 | f0fd6321b839904e15c46e0d257fdd101dd7f530fe03fd6359c1ea63738703f3 |
| wheels_comfy | pypi.org | opencv_python_headless-5.0.0.93-cp37-abi3-win_amd64.whl | 43825962 | 829717b6a95554f273e49e357cee3b3a2a26b6f4842fbc1bed2b45bdd8f87e0e |
| wheels_comfy | pypi.org | packaging-26.3-py3-none-any.whl | 129956 | d7193f7c8e4e93f444fde0262bf90af30e16fa0ad0ad44cb553c87339b23cd1c |
| wheels_comfy | pypi.org | pillow-12.3.0-cp310-cp310-win_amd64.whl | 7226887 | 300557495eb45ebb8aec96c2da9c4be642fbf7cd937278b4013ba894ea8eb0eb |
| wheels_comfy | pypi.org | propcache-0.5.4-cp310-cp310-win_amd64.whl | 46589 | 146f48a9e4812611a7581003b1a39de56c34967046310c4171a68ef908c9a745 |
| wheels_comfy | pypi.org | psutil-7.2.2-cp37-abi3-win_amd64.whl | 137737 | eb7e81434c8d223ec4a219b5fc1c47d0417b12be7ea866e24fb5ad6e84b3d988 |
| wheels_comfy | pypi.org | pycparser-3.11-py3-none-any.whl | 51178 | 51d5a8ba2be0bbe440b99d2112604c95bbbc3c2748a64260186c541e1729cd80 |
| wheels_comfy | pypi.org | pygments-2.21.0-py3-none-any.whl | 1250147 | 2363c69b61c4a97c838da3b130dcd6468f4848992b21a82f2a63ec34377137d9 |
| wheels_comfy | pypi.org | pyyaml-6.0.3-cp310-cp310-win_amd64.whl | 158561 | bdb2c67c6c1390b63c6ff89f210c8fd09d9a1217a465701eac7316313c915e4c |
| wheels_comfy | pypi.org | regex-2026.9.29-cp310-cp310-win_amd64.whl | 280629 | 23ae6fdad9e63e54038f5ef78aba2933faca61e24d432786589e737bc5522ebb |
| wheels_comfy | pypi.org | requests-2.34.2-py3-none-any.whl | 73075 | 2a0d60c172f83ac6ab31e4554906c0f3b3588d37b5cb939b1c061f4907e278e0 |
| wheels_comfy | pypi.org | rich-15.0.0-py3-none-any.whl | 310654 | 33bd4ef74232fb73fe9279a257718407f169c09b78a87ad3d296f548e27de0bb |
| wheels_comfy | pypi.org | safetensors-0.8.0-cp310-abi3-win_amd64.whl | 355540 | 096ec1a98435df7beb08853bb5aa9081a84f23d0adc67ed1a0a10550f608373f |
| wheels_comfy | pypi.org | scipy-1.15.3-cp310-cp310-win_amd64.whl | 41259201 | 9d61e97b186a57350f6d6fd72640f9e99d5a4a2b8fbf4b9ee9a841eab327dc13 |
| wheels_comfy | pypi.org | sentencepiece-0.2.3-cp310-cp310-win_amd64.whl | 1652913 | 901f38530a93e14505bfa3279c8a4705158f30af406bc2721cf3ffd7175170c2 |
| wheels_comfy | pypi.org | setuptools-84.2.1-py3-none-any.whl | 876263 | ca140b45d5325a9478f880e351484f62fef15f336462e449ca0c03c873d589c2 |
| wheels_comfy | pypi.org | shellingham-1.5.4-py2.py3-none-any.whl | 9755 | 7ecfff8f2fd72616f7481040475a65b2bf8af90a56c89140852d1120324e8686 |
| wheels_comfy | pypi.org | simpleeval-1.0.8-py3-none-any.whl | 18925 | c9c4ff42879ebf0c05f6562cb81031869948916be343bcc950b81fcc081fe9ce |
| wheels_comfy | pypi.org | sqlalchemy-2.0.57-cp310-cp310-win_amd64.whl | 2179891 | 88007e8f5f263ca7c8adfef6425037e134ddb6a67a99e07cbd304a208a8a4938 |
| wheels_comfy | pypi.org | sympy-1.14.0-py3-none-any.whl | 6299353 | e091cc3e99d2141a0ba2847328f5479b05d94a6635cb96148ccb3f34671bd8f5 |
| wheels_comfy | pypi.org | tokenizers-0.23.3-cp310-abi3-win_amd64.whl | 2872101 | 1f0823bb00c5fdc98e487354d54dd55a03848d61a1a0bf29a68c77f24f3b26c3 |
| wheels_comfy | pypi.org | tomli-2.5.0-py3-none-any.whl | 14765 | 32a7b79ac57a2e83670ce329ccf675798bc5a2094783a63676866b70503f2e2b |
| wheels_comfy | pypi.org | torchsde-0.2.6-py3-none-any.whl | 61232 | 19bf7ff02eec7e8e46ba1cdb4aa0f9db1c51d492524a16975234b467f7fc463b |
| wheels_comfy | pypi.org | tqdm-4.70.1-py3-none-any.whl | 80199 | c293e525e6fef9c20e8728fd4612df02a0aa31bb5fe91ecd93e123b1b7bffa73 |
| wheels_comfy | pypi.org | trampoline-0.1.2-py3-none-any.whl | 5173 | 36cc9a4ff9811843d177fc0e0740efbd7da39eadfe6e50c9e2937cbc06d899d9 |
| wheels_comfy | pypi.org | transformers-5.20.2-py3-none-any.whl | 12844921 | 7ae75dbc1fb3922aff1b6c97b9e5479d6cf26fd86a8866bfb71324190479f807 |
| wheels_comfy | pypi.org | truststore-0.10.5-py3-none-any.whl | 19017 | 9aaaedaefaf06d8b206278cf8b5012bc897f485a874503501e12d776df78951c |
| wheels_comfy | pypi.org | typer-0.28.0-py3-none-any.whl | 123253 | afd18929180b706c5e9a239f53c3c8136903553c0c2d460598bbaa924191d4ab |
| wheels_comfy | pypi.org | typing_extensions-4.16.0-py3-none-any.whl | 45571 | 481caa481374e813c1b176ada14e97f1f67a4539ce9cfeb3f350d78d6370c2e8 |
| wheels_comfy | pypi.org | urllib3-2.8.0-py3-none-any.whl | 135717 | 0cf3cae568d36aa9576b28dfb35f11328f1cb974ca7647d9475ebb86c75ac6e3 |
| wheels_comfy | pypi.org | yarl-1.25.1-cp310-cp310-win_amd64.whl | 102929 | 3f4d48a6112712973e676bd792121fee470e432d749177162d9949d5c9460a1b |
| wheels_comfy2 | pypi.org | annotated_types-0.8.0-py3-none-any.whl | 13427 | f072f4d804ea359e4eaf198b1af7a8b0943881a87f31bb764f8bf219bb9419e0 |
| wheels_comfy2 | pypi.org | pydantic-2.14.3-py3-none-any.whl | 494071 | 3f7b347782ab7e4cf4c798496ae3a82787d9f21ec12676a9c564355eeef8daa8 |
| wheels_comfy2 | pypi.org | pydantic_core-2.50.4-cp310-cp310-win_amd64.whl | 2259729 | e512c75ec5cf4475c1aa50ad975ecdf253f4963b06e152e1a11edd6de4010753 |
| wheels_comfy2 | pypi.org | pydantic_settings-2.15.0-py3-none-any.whl | 69413 | 0ba092c291c94baceb5eff768aa0d56400a457585bc0175925a5a5510303da42 |
| wheels_comfy2 | pypi.org | python_dotenv-1.2.4-py3-none-any.whl | 23266 | 42269a8a5b3fd54ffa6f3d84b18abed50064717576b4ecf03dc4a55d8aa04fdc |
| wheels_comfy2 | pypi.org | typing_extensions-4.16.0-py3-none-any.whl | 45571 | 481caa481374e813c1b176ada14e97f1f67a4539ce9cfeb3f350d78d6370c2e8 |
| wheels_comfy2 | pypi.org | typing_inspection-0.4.5-py3-none-any.whl | 14874 | bc210535442b39e1bf2805e0c7a17dfd6a4ace760c84c7f7d16245d23a6b1c39 |

Sources: wheels_torch = AMD package index https://stable.repo.amd.com/rocm/whl-next/ (redirects to /rocm/pytorch/whl-next/); pure-Python dependencies of torch resolved by pip from the same index; wheels_comfy = pypi.org (ComfyUI's requirements.txt, essential section, plus NumPy, opencv-python-headless, SciPy); wheels_comfy2 = pypi.org (pydantic, pydantic-settings: ComfyUI's requirements.txt; ComfyUI does not start without them).
