import { assertType, describe, expect, test } from 'vitest'

import { anvilMainnet } from '../../../test/src/anvil.js'
import { celo } from '../../chains/index.js'

import { createPublicClient } from '../../clients/createPublicClient.js'
import { http } from '../../clients/transports/http.js'
import type { Block } from '../../types/block.js'
import { getBlock } from './getBlock.js'

const client = anvilMainnet.getClient()

test('gets latest block', async () => {
  const block = await getBlock(client)
  assertType<Block>(block)
  expect(block).toBeDefined()
  expect(Object.keys(block!)).toMatchInlineSnapshot(`
    [
      "hash",
      "parentHash",
      "sha3Uncles",
      "miner",
      "stateRoot",
      "transactionsRoot",
      "receiptsRoot",
      "logsBloom",
      "difficulty",
      "number",
      "gasLimit",
      "gasUsed",
      "timestamp",
      "totalDifficulty",
      "extraData",
      "mixHash",
      "nonce",
      "baseFeePerGas",
      "withdrawalsRoot",
      "blobGasUsed",
      "excessBlobGas",
      "parentBeaconBlockRoot",
      "uncles",
      "transactions",
      "size",
      "withdrawals",
    ]
  `)
})

test('chain w/ custom block type', async () => {
  const client = createPublicClient({
    chain: celo,
    transport: http(),
  })
  const block = await getBlock(client, {
    blockNumber: 16645775n,
    includeTransactions: true,
  })

  const { extraData: _extraData, transactions, ...rest } = block
  expect(transactions[0]).toMatchInlineSnapshot(`
    {
      "blockHash": "0xac8c9bc3b84e103dc321bbe83b670e425ff68bfc9a333a4f1b1b204ad11c583d",
      "blockNumber": 16645775n,
      "chainId": undefined,
      "ethCompatible": false,
      "feeCurrency": null,
      "from": "0x045d685d23e8aa34dc408a66fb408f20dc84d785",
      "gas": 1527520n,
      "gasPrice": 562129081n,
      "gatewayFee": 0n,
      "gatewayFeeRecipient": null,
      "hash": "0x487efb864b308ee85afd7ed5954e968457cfe84e71726114b0a44f31fb876e85",
      "input": "0x389ec778",
      "nonce": 714820,
      "r": "0x1c0c8776e2e9d97b9a95435d2c2439d5f634e1afc35a5a0f0bd02093dd4724e0",
      "s": "0xde418ff749f2430a85e60a4b3f81af9f8e2117cffbe32c719b9b784c01be774",
      "to": "0xb86d682b1b6bf20d8d54f55c48f848b9487dec37",
      "transactionIndex": 0,
      "type": "legacy",
      "typeHex": "0x0",
      "v": 84476n,
      "value": 0n,
    }
  `)
  expect(rest).toMatchInlineSnapshot(`
    {
      "baseFeePerGas": null,
      "blobGasUsed": undefined,
      "difficulty": 0n,
      "epochSnarkData": null,
      "excessBlobGas": undefined,
      "gasLimit": 20000000n,
      "gasUsed": 5045322n,
      "hash": "0xac8c9bc3b84e103dc321bbe83b670e425ff68bfc9a333a4f1b1b204ad11c583d",
      "logsBloom": "0x02004000004200000000000000800020000000000000400002040000002020000000802000000000000180000001000020800000000000000000000000000000000000000022000260000008000800000000000000000000000000000000000000000008000410002100000140000800000044c00200000000400010000800008800000080000000000010000040000000000000000000000000000000800020028000000100000000000000000000002002881000000000000800020000040020900402020000180000000000000040000800000011020090002000400000200010002000001000000000000080000000000000000000000000000004000000",
      "miner": "0xe267d978037b89db06c6a5fcf82fad8297e290ff",
      "nonce": null,
      "number": 16645775n,
      "parentHash": "0xf6e57c99be5a81167bcb7bdf8d55572235384182c71635857ace2c04d25294ed",
      "randomness": {
        "committed": "0x339714505ecf55eacc2d2568ea53a7424bd0aa40fd710fd6892464d0716da711",
        "revealed": "0xe10b5f01b0376fdc9151f66992f8c1b990083acabc14ec1b04f6a53ad804db88",
      },
      "receiptsRoot": "0xca8aabc507534e45c982aa43e38118fc6f9cf222800e3d703a6e299a2e661f2a",
      "size": 24562n,
      "stateRoot": "0x051c8e40ed3d8afabbad5321a4bb6b9d686a8a62d9b696b3e5a5c769c3623d48",
      "timestamp": 1670896907n,
      "totalDifficulty": 16645776n,
      "transactionsRoot": "0xb293e2c4ce20a9eac253241e750a5592c9d3c1b27bf090d0fc2fa4756a038866",
    }
  `)
})

describe('args: blockNumber', () => {
  test('gets block by block number', async () => {
    const block = await getBlock(client, {
      blockNumber: anvilMainnet.forkBlockNumber - 1n,
    })
    expect(block).toMatchInlineSnapshot(`
      {
        "baseFeePerGas": 9036579667n,
        "blobGasUsed": 0n,
        "difficulty": 0n,
        "excessBlobGas": 0n,
        "extraData": "0x6265617665726275696c642e6f7267",
        "gasLimit": 30000000n,
        "gasUsed": 11308235n,
        "hash": "0xa93b995575bda48d4cf45a4f72593a48a744786b5e32e5ff92a21372f7a60875",
        "logsBloom": "0x05a1757a816e01054954b14aa90152112749c1e05a8e8580ad09ec562c40181205c424b4c543622dee0b0b45628f2b4d625340669a8021a46854300118fa2040303cf68a78018f782c03753b20a160a468814401346e5c5b8316534583e048a15bcb87e60f60506f0dad9f405372295989185f6d0b001c3cba505c9d5c89453a28249a72b8b2b01402e805d93a2b264ea83c4f2ddd88006f260900464a7333921a22ed6914197c06cc4671e8e8922c2805cd4e064415e24c0f39beea1a8ca3c03fd15e92045b17d6454837b4e3d840c02b613616e6ca55140843773a311121f2a396f60229532230a61c3687a4150dc5059f70a9fb2821db940c681d240a8cc5",
        "miner": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
        "mixHash": "0x9f108d6eec7e2a11cdcb257f80b91dce7c70af0f5f3c60732499cb549eadcbc8",
        "nonce": "0x0000000000000000",
        "number": 19868019n,
        "parentBeaconBlockRoot": "0x159035f65cb1ea0ff28d439e4f2b3b751c24c6710eda930bc4d7121881885a0b",
        "parentHash": "0x28d779fee521840d1b80b3a457259e34910e8ec871ca75f90e1f7d0a1a8e846b",
        "receiptsRoot": "0x415b9f4b2083a75dbb81d9f234653b34e7a9e02394f5e49259c443aca10088e8",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "size": 62253n,
        "stateRoot": "0xe37f6c0612de420b2103e0a1d7ffb828fd6081e60d9edfa963f7c4a8feea54ce",
        "timestamp": 1715686967n,
        "totalDifficulty": 58750003716598352816469n,
        "transactions": [
          "0x985ca9ceaecc90bded8a892e45e2127eab09746cd7dffee057fba12ee066e161",
          "0x32e57c908dc3407db0e54edaa9ed47419012ea97254c14e20111f7b5fef24eab",
          "0x36cc29ccb58c330eee72456b504ddb5f6e94d6d858c86f63eb0ea34937dd89f3",
          "0x5966da273533a59076559d4194d78243f84dd81d891d4c51d3a863265b3a5596",
          "0x954e99a632475510053291953e6e351f4b53a4f55a3a81ae0bab9b20d6d729a3",
          "0xdebbde52240c719e275d892453a2060b4867a9a19a8bdcbfd2e0dc0ad49b48cc",
          "0xc9ab9e94ed525a75b1df3f1d81dc33378f17a4f9b2601719c911898f0cbb1fa3",
          "0x64bda7ad4d287b86ef5d04f393807b1e603cdf0f199a4d1a79ed1ae82b026b8f",
          "0x4d33586bb3f42614f3e7b326006aebf88883d1ca040365123b48a65ad2dcecc2",
          "0xf82cd8300c78adb5700b5fb446750d808657f7e9ca330682e5d2ef4f4f67e07f",
          "0x4af59730297eeac03919b73030194c98571d50472bad27e3bede0c9da9ec0687",
          "0xe17f6b1fa7a6c45528d9fed517135362235771490a5d4d03e373cb34e5aa9941",
          "0xc5ef59abc312c2a069057ae5809b81ccb4f87fdd630f6d7dc9123039e09c87f2",
          "0xc9b60bcae977cfac8a0245e63ca3746c97d22c4c482b2d8a0d9d4d2f52d1b24d",
          "0xf1f587b26b091a023b65bf25797e829fae7de9ca084e2bee4fb0b7d2bccf18f5",
          "0x4c7a89f68bbee851386d897c9fc85504faa514549e765257b707b3d8ec32e3c7",
          "0x0aa0f51b90c6cdc0b1d01ba17304f6936e947e0c6949cc085b5d266e63a7305e",
          "0xe96aaeca9a319dec34298a596591c3d1dedfe03fd8d17dc76c3f5b4819d9289a",
          "0x7b43eb268ced6537a438a43e2c15f18ed3fc0acb3a448841309d1e59afdb59e4",
          "0x9dabe3cb5cbff0cc89fd935b29095fc4b4d79e73d6799665197b209e8fae43e6",
          "0xb084ff374e32df40d8af00b962d09a482df74f8d8453501e0e80659568f5f567",
          "0x054e33d58d1486ed33072aba9ed23db975a068da02a33b3985cb9f5894d05836",
          "0xdfa3df293acfb0654a1c615387f84cc630a20a70d191cbb0b8aa7c128b2aa786",
          "0xd62eb265e3538f00aa676da3e82b42bae4162f9e18185e4dfbb338a637c9fd23",
          "0xe9c0f5bc85672715b510331fb7b729c5585161d0b3b6878e707633848fa1c55b",
          "0x9a83cfa21bc42f15ffb048d6f9713b2f6474313d5d56f75856fbd1fee612c989",
          "0xbc12168406a65ec994167f8aa922c799d882882278ba447b21fb7cc1403c449e",
          "0x70931c24291dc10d944cc6c5e0c2ec250917795dcb4f0b364ac031c13793c083",
          "0x24c2eac200b4fb5568c02e100e09022f0a07e4e299425ce45bea3a212e6560f6",
          "0x49e69ab10d9de86f9de6c36476724feb54ff6b8dcc9c0317a8b346044d8e78b3",
          "0x19bff8bb3ab9707850bd48772b4bb6d832fd9ed916fdd446f0906df1f42a04f9",
          "0x248964bf8faae6d9949e453728f78eeca8420f8df791862164e614d999f07442",
          "0xabf9f2cc992ffeeacbe3058aca7b24659ba403aa894f1975422a3dbcb0ada1f6",
          "0xf17d415c1393ab67869b4233c8b957abd36fd22f2e99d4fff501ec4172e33e34",
          "0x08916abc5c7dbc0b562148bc0e7f736695b6e105bc7b16bde63515c3af0940cb",
          "0x01b9a5d3a6b72345601bac13a6193f97ebb65e117d161daa4ce45e6420e0dc21",
          "0xfa86d494adf37e298252a1d33da21e3709e84f9a35b99c49c6ca2ee598cb0ae7",
          "0xc0f6358b454520cb42f05f7db8dee63b4ba375c3dff1162d249c87beb5c137d3",
          "0xdd87e0e0c1e44179fb729edac2416c128c252f61a85bf7b7a578ec8013c10209",
          "0x4a949fdc2dc7f170508afbb06b80e426f92e48c1550b0d6c1c8c1ddbe3968748",
          "0xb78aa0dfcf908802a886fc9a8b9e15f03d18e4c4ae61bcc0a588ac0bfe0b0f61",
          "0xce8ead19d931f821120e94d0461cd56c240c002779e38a16c591b2c2807f37a7",
          "0x386d753fb5083fc234893a6bad40a3cc928b0d90450aa8b771e67ccbebf13716",
          "0xd6e36c2a1070fd206fb2b24a0b1a46b07a1226f3bc29e239ebbe030e9961772c",
          "0xc7062f57dac83118e46e6396013492fed7f9529d21f37fadba50ba30cdb0c978",
          "0x3213edd32bb188a4ca62d67f26eb8e92c6bc66d4349a42a22c7f35727a73410a",
          "0xe37ef15fab42af9e2f947407b2b33dcb6897f0269f1da49cb27d35d5f7f9e9e1",
          "0xbd510d6ec9800a65f217a160b71da9c969fecce0c342dff259ee48004f380738",
          "0x0fd4ad04f97243f742259c1789a631667c04c32b2fe69f7ba51a5bcc0612251b",
          "0xc428fffb5eb2b53a897d0382be27f6a8b8a465508e6444a77533538029397f96",
          "0xe20dc556bd5cf5ff20cae88c120e614c5b679b2c7eedc8063b933a188e3c19fd",
          "0x8175512f8a95771a6ecf77fc2024076c22bd7324b76fe831199a243aa4a27c0b",
          "0xa18a7ce1f0d24e0e6e366253e5b60f0b348714dd9254134338f86ac8207a5e7e",
          "0x22df74019c85f345f10c0823e62ff1819d9e72115f4a0a1bf58352b55def0550",
          "0x51fcd2225be22e0411ff66388c76569d56cd443792c3f9814533ba7321e3894b",
          "0x3a40c844659959b519c903a5b3eaa74feedcb7ae2dab222af0b98dd1e613152f",
          "0x4f7b4a2b0d4705d6060705e0cf3e73e20e197164fd67e4109fc830bb464af529",
          "0x5d31186046cf78e96391e81c38f62878b9b7591dbf0baed5da7bc2c1e036cdd8",
          "0xd32ea7644b3daf36c6581e46a2dc3f3127ee3724951b9f02d2b94d4082c4b77a",
          "0xaaa6c054ff6238551d406f07369733217328f4c378a28acf6cef0cebb1aa853b",
          "0xef0b0e0c2865aaeba2650380be07647e0feea0694ba627d13c5dd84f22db08b0",
          "0xa50af96ab161215eaae753858a52b09cb1c4bf398069a1a0d16ecf5ede0fdb2e",
          "0xfa64d4e29cc662b66d933cda646a63de1e472df3de9f3e20578ce40476f6496a",
          "0x6f64c328b7a75d43fd18f2899dde7b12780b9e80205f6ce4f4a2a55a9c10ef92",
          "0x7624837a43c3af5772d4b558c79e316ebc49b54bd5a42481a86e63780a3f4614",
          "0x35d17c91123e5279f369c8c33da9843e1fe5ad2ec075ea36e60871e6771f254e",
          "0xbd86c865f636fbbeb047aa3c011d7c4d12ff188ac620868390a81712ba4f5bc6",
          "0x13b2e551aba2eece336b98dbab7e779a131d66f7d0c2d778ee5d33d71cbc3b91",
          "0x9a26feb4b547431746ae8cfab96be6e12726e3cb0b77af2db26375f3e649ee46",
          "0x9bd36aa10c3efc073c2da0c9a1eb21c2b609d2c0f5d786db3fe91a46d2995e14",
          "0xd286dd2dd0137526319372bbe0f9a79442d6b98731fc0495f5ad29dca872c4ba",
          "0x60c3c92422ede1228e077bcf04461e2d050b51d3a020e2f54a1c01ae2780bdef",
          "0x03fccff77cb10c90d5438a0a1b336ea17ecbd5ece5fb13a1ff4e2e22074708ce",
          "0x265b734355531da082476663f1f5b3d6927b440dc468615156c1cf1a1db3561e",
          "0x0cade2907a0e2441406b893429e1e356eb40f5244f1cc841648bc6e11ab73feb",
          "0x302e20a6d06555ff9c68de463b52c7383287b75eb8500d6ff020d735fda590e6",
          "0xb07b2d7833d1ddaf0fe2d16114664e370eeec8f4dfecbad5c165e9633b338a53",
          "0x497a45dd663b3cd6ddb805a4483391ca0b0c8e7c140d40ec1c372889d2ebdfd5",
          "0x4189d0c8571b291e4a571320dc20893c8663a48e647c97d2c0466796f417ff9d",
          "0xfc3a8e8b5f6f430f850acba920be6f6d3a21387ec2d4f55dad0963db1d55e724",
          "0xa249ca00a171408d2fec293cbb8090cddbf1dc12a6810fc1045f1c0762f9dee2",
          "0xe13f9ab1104d3e6e76c8d7f0a2beb2bd14f38ddea8a6a71742ca7dce0cfa06a1",
          "0x9e914125cb609aa76fbd517b4fda29b2cb4a38c35a6c5fec522cc704ca6b78c9",
          "0xe87ab3af19aa6a47981adba95fa8d9cb374e2b049bcfde2ee36b2be570831bd0",
          "0x7343d51b2b5e61c1b955cd8a3ce88c063c0cbdd4b4a57b613645b0d41d2bc4de",
          "0x9486fb9ff288444fbd27bb0cc1ea65803dc4665fa0510792064a71edc81fd38e",
          "0x6c7d81763741c66b1cd8b26412e349d9eae5acbc59b2beb24eb1773f4afac015",
          "0x6d9c5dcb8c9d0e109a944a9acba0f750f3c2571ba5a1cda602497393001af0a5",
          "0x9c2fab0ebc32b28e2890af06b0eac948ddc0c21389daa2152e8f19571abfb575",
          "0x793fe36c8910f2897491292b4dd027ddb4dbebe04fcbf3665ee49d1da17bf9f9",
          "0x63ecbbaec1a9caccd37834d169131519be0fd4ff5bbd024752e08d6bd4182f67",
          "0xe34feab296b36a546744ba6127a679ef991771785be7071cc549be7543df6a73",
          "0xefc6e872e1c01d377005b6cc2d91f0dd8c761c9aff5e334186fa2ca216199e63",
          "0xdf8a3c3701684893c3deb5ea2849a98147eedd1a5cda71ad6ea30c6d8a676c4b",
          "0x27cd453d78c36dd1edcd9a3cb2adb21f4826407febf81f34dcbfdbcc304c1693",
          "0xfe8ec22519f7c941c793e60fe473061c572480f5f71ef811879253c27feec192",
          "0x2547f3cfe5210cdc1534e782ef1552c55dc6edc1bc014833c560cbe95beb18cc",
          "0xe6cd4feb52ea15bc1dc064fe1cd25de83378d2b59365b0b31b1f1a118b36f1a0",
          "0x092aa45e682fe43480f2f90b46414d565d4be4a78ea8c6b4d3f2be56d99afd2b",
          "0xd8a82f85b7d571eeedb0dfc2537bd621383cb70a8a6b56ecbb5da0a483d972c0",
          "0x9242d4aad949fc46a1f7b4ed2c973f25e02d4a3bcf716bbbb4bd83deb339f6b1",
          "0x6f1bd81793fdc7d0952f81ee659c598eed80e151915996c90cf456c86ef25c9f",
          "0xd39e3fbb0cd22d78b6be12b3f2a8081ba1ac93d0af0df53ca379ddd8ea2c8e6d",
          "0x21184cca95fdd55d2a5e6e1ac68c1fde6624be4077afeec35be12ab3337bb6f2",
          "0x46f7a1329c9859de6fde82c92c6650f1f4f0b16c8c3788d473b279326d6ff759",
          "0x17150b2404ffae04e39186628ff38bbee557c415d4ef1a31578e5570c0ac1002",
          "0x551917037f6cf7ea340fda07aff14cba09d087725848c11cefed0338d726f154",
          "0x1a9d126a22e407d939165319347f3ca18058c7cfa9539266aaa52ae049216821",
          "0xca9f9ff07879588cc08835cc45ef27629a218d5103b15caefb90819df4416626",
          "0x2030f9e7486da9cb5434ac2ed67552e914a9ffdc4663de2604ed9bf036492c58",
          "0xcd1af8ecc3de9576522040bf607340db9b064caeebc9e853c68b0ce9b86954d8",
          "0x9f84abff04edd7316ff6634b46cbaea92921625faeb6accffd29467fcd3d8b56",
          "0x3e68b854068a98c5de20d32ebcb6079821d8fb9bae9ede10aae80d1174ea2f3f",
          "0x97768c4dd3450be389f0a9ad70b2cd66155e60baf8ed4c58550cfe5992becbfe",
          "0x759b74b4b996e39a73d89dbbec4de4349e07e5dcd4aea3f6ad18b3a1aaa9e7be",
          "0x858345a04dc7ade8de93a9c333fbcb62d33e6aaf7983d38fddc75fcca7a436fd",
          "0x3c9882c289609b442085b06dfd072ed2de2207fb46fccb4f76bcfe5d210bc280",
          "0xf8c1f4b2f65f097a420c7e575f8c1e73c9d614af62715eb5306f347f9c5ad0a8",
          "0xf9881f2316305ed8866d36253e4c8b58e1bc96fd2404a9e1c559206dcf3d3de3",
          "0x0b069dcee506650aa45fb2f9ea4f5c6cf6cc746e96d72b08f6ae20798e2c05ba",
          "0x8833a57ce6aceb81ecd1cf75b6cada58c78d77035843313b78f1a1417f11d00a",
          "0x5eaf5d98f1ef1ad84e6df6135717ef198cac4ab430c9cd5c7b59c39c48535ef8",
          "0x763140b4b7f4a68eabac21e0c98aa7cb013a914abac7000fd20550db2b39348b",
          "0x45d05a377106383e0307f404d0eeb9c899bb34e1572af85c7b38e7836290b3c9",
        ],
        "transactionsRoot": "0x202fe84b06e824fdf77a2f47762188f9346cbd82994b90ee5a063c8202eb7212",
        "uncles": [],
        "withdrawals": [
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b3013",
            "index": "0x2b3aa1b",
            "validatorIndex": "0x36305",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b82aa",
            "index": "0x2b3aa1c",
            "validatorIndex": "0x36306",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c3fd2",
            "index": "0x2b3aa1d",
            "validatorIndex": "0x36307",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11cd47e",
            "index": "0x2b3aa1e",
            "validatorIndex": "0x36308",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11ce36c",
            "index": "0x2b3aa1f",
            "validatorIndex": "0x36309",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b7466",
            "index": "0x2b3aa20",
            "validatorIndex": "0x3630a",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11ba415",
            "index": "0x2b3aa21",
            "validatorIndex": "0x3630b",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c2d03",
            "index": "0x2b3aa22",
            "validatorIndex": "0x3630c",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c8650",
            "index": "0x2b3aa23",
            "validatorIndex": "0x3630d",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c5852",
            "index": "0x2b3aa24",
            "validatorIndex": "0x3630e",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b35b1",
            "index": "0x2b3aa25",
            "validatorIndex": "0x3630f",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11bd2a6",
            "index": "0x2b3aa26",
            "validatorIndex": "0x36310",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c99b6",
            "index": "0x2b3aa27",
            "validatorIndex": "0x36311",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b2b56",
            "index": "0x2b3aa28",
            "validatorIndex": "0x36312",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c9b59",
            "index": "0x2b3aa29",
            "validatorIndex": "0x36313",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b10e6",
            "index": "0x2b3aa2a",
            "validatorIndex": "0x36314",
          },
        ],
        "withdrawalsRoot": "0xd420104a95094d97f7f94cde407b748e8613135ee7424f52164b39a44fe8a4cb",
      }
    `)
  })
})

describe('args: blockTag', () => {
  test('gets block by block time (latest)', async () => {
    const block = await getBlock(client, {
      blockTag: 'latest',
    })
    expect(block).toBeDefined()
    expect(Object.keys(block!)).toMatchInlineSnapshot(`
      [
        "hash",
        "parentHash",
        "sha3Uncles",
        "miner",
        "stateRoot",
        "transactionsRoot",
        "receiptsRoot",
        "logsBloom",
        "difficulty",
        "number",
        "gasLimit",
        "gasUsed",
        "timestamp",
        "totalDifficulty",
        "extraData",
        "mixHash",
        "nonce",
        "baseFeePerGas",
        "withdrawalsRoot",
        "blobGasUsed",
        "excessBlobGas",
        "parentBeaconBlockRoot",
        "uncles",
        "transactions",
        "size",
        "withdrawals",
      ]
    `)
  })

  test('gets block by block time (pending)', async () => {
    const block = await getBlock(client, {
      blockTag: 'pending',
    })
    expect(block).toBeDefined()
    expect(Object.keys(block!)).toMatchInlineSnapshot(`
      [
        "hash",
        "parentHash",
        "sha3Uncles",
        "miner",
        "stateRoot",
        "transactionsRoot",
        "receiptsRoot",
        "logsBloom",
        "difficulty",
        "number",
        "gasLimit",
        "gasUsed",
        "timestamp",
        "totalDifficulty",
        "extraData",
        "mixHash",
        "nonce",
        "baseFeePerGas",
        "blobGasUsed",
        "excessBlobGas",
        "uncles",
        "transactions",
        "size",
      ]
    `)
  })

  test('gets block by block time (earliest)', async () => {
    const block = await getBlock(client, {
      blockTag: 'earliest',
    })
    expect(block).toBeDefined()
    expect(Object.keys(block!)).toMatchInlineSnapshot(`
      [
        "hash",
        "parentHash",
        "sha3Uncles",
        "miner",
        "stateRoot",
        "transactionsRoot",
        "receiptsRoot",
        "logsBloom",
        "difficulty",
        "number",
        "gasLimit",
        "gasUsed",
        "timestamp",
        "totalDifficulty",
        "extraData",
        "mixHash",
        "nonce",
        "uncles",
        "transactions",
        "size",
        "baseFeePerGas",
        "blobGasUsed",
        "excessBlobGas",
      ]
    `)
  })
})

describe('args: hash', () => {
  test('gets block by block hash', async () => {
    const initialBlock = await getBlock(client, {
      blockNumber: anvilMainnet.forkBlockNumber,
    })
    const block = await getBlock(client, {
      blockHash: initialBlock!.hash!,
    })
    expect(block).toMatchInlineSnapshot(`
      {
        "baseFeePerGas": 8758571930n,
        "blobGasUsed": 0n,
        "difficulty": 0n,
        "excessBlobGas": 0n,
        "extraData": "0x6265617665726275696c642e6f7267",
        "gasLimit": 30000000n,
        "gasUsed": 13655878n,
        "hash": "0x0c3e51fc62e1dd7401c8884882755b72e1c5720d0b01c75443cdfa8a129d3fc9",
        "logsBloom": "0xd123054441c15c9d30998061c8899fbdb40be9b00b9c9b73202d015aef6a92b80e6a1520ca498004de50db02f992518322199054de076a903019e47aa1a8b018a046a6c95d2d39a92c06e33ea9a225aa80c5408964c57f5fe083d5dc8a7051e5e92f4844e244023e90cc74c040236e49c31b9aa023596ec5aa1c0e1458593c036dbe9f7cbaa69538a2ed205c0ae2145e441b1319eb6946a9d82da46e6e9c0ca85f9688c6fa946b844bbdd4cc3f225ce09641d62220214a7cb9744c66340c807013f0315212455a000620a3b27359c8c13e1000130da23e141107d28a4900e1909470a80b03d746114b1596d3a4430b68b4ff3e219bac38d8dfa1680ae4005d4d",
        "miner": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
        "mixHash": "0x7702b2acc3443bd74c0b3ff142414f9d51e4caa0f111d57d319f4d46e21dedf7",
        "nonce": "0x0000000000000000",
        "number": 19868020n,
        "parentBeaconBlockRoot": "0xd472790dc1fd2d1b1cc9e208706266196f261e4c1a74f535d86981670c0d5f99",
        "parentHash": "0xa93b995575bda48d4cf45a4f72593a48a744786b5e32e5ff92a21372f7a60875",
        "receiptsRoot": "0xe2822bc9663118439077ad806cd7a2a1a75bf1d70bf61d901199cf599c46f9d7",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "size": 56024n,
        "stateRoot": "0x115fd5eac921e6728825958b2b87da8aaf17edc0085164f11de798f6ed00abbd",
        "timestamp": 1715686979n,
        "totalDifficulty": 58750003716598352816469n,
        "transactions": [
          "0x5d374a026007c13e901765497b9164d44822902463efdf7b574b10c476ee2ad6",
          "0x2762a7fb7c973e888edc457a3808d3882b5c8fc4f6c43a082d823319b126b91a",
          "0xe637d86545a9b508b373fdd46cc71682ac4a5dba222d7c9ac01380306cc96cd9",
          "0xecdfec41e9859fa217c5467debc9a5fa95290c3273f0ecf282f802983d2ca105",
          "0x75f544151f040710f96a2c8cd6da6cd7bb60e461bfc9b4f87d015562d9a55328",
          "0x07e609166382b05cd4cfd59764226374af8457a5dc0cea255721e5570cb32844",
          "0x08109ccb2b1609d10cd929594ba3a131d59c7aa6eb174cc7bf578670a8198405",
          "0x932fb264036b15e8a9704501e4f1ae34a9ac7543c498223c3456f03ebbefe221",
          "0x4773aaf55c914947aeefe6c996b961c900bddd82b4e809d47a5f99af22b014ef",
          "0x04d0728690604a7ec930782021704bb5d75d16d2c3330f8ab051348c906c52d4",
          "0x61d5fc3a8aa4f5e802dcd54a7fceaad89a97c873578b845ad12b34a96540aeb7",
          "0xd14bf1505356f83e55d4baffa315e0e9210479dff7486c4164a050c935d5bccf",
          "0x6c4e8a1e9484ad717ef42df12a6cb9655216b6a2f7420f52dc540ed952860fdb",
          "0x1d2361b3ec4fcb498732048e348fec130f15fb7e05187d8878985681c506b32a",
          "0xc3da74a44904c29c9046587cbade10386db5aed500d7ead58335a9757fc64c93",
          "0xc8632c7648b32e86023d8b585145bda62e5f8c160a5e6c8c02ec183297d05d2d",
          "0xb6a79dcd720a72d2ea5728a8e58885304202535b00861113dce00d07bca7f3ab",
          "0xc8b9a208eccabd84320946527cb1df897ec48318c1ca67e5fedc48388152518a",
          "0xd5b0feea2d8e474913d280c45c4a6e365ec2bd8ab09982f0b07a7e6e2e433526",
          "0xd67fa075f7abde07de71273e227856b43373276f18eb1446d1566cfafe896947",
          "0xca96b4905a5854d52f3152dc2f86b1e8ef0891ce82b8a6d0622d4470fa980c03",
          "0xd80b94b3d5e72e1cc74b3acbf6bec79bde51d6341f021a1259fe2e3303a919f4",
          "0x0e034d76d3593f1f07baf2452e337da912dfc06fd61704e658797eaf5c33222e",
          "0x755a7415073e029b231d575f935a10ae657eb30d3aa3edd32fcfc812ba2075b9",
          "0x082bebb8c90bc915b6931d6d135ae7016a41b01e6d07151b5d11d2e3cc15868c",
          "0x5a550298d163c3a6b1ca91412076781462a6e77825a7a34789e514f566a2ddd2",
          "0x7f5523181ea3b7b83577e2de0ff3edf0b7bed050436fd6958274a0a6882a487d",
          "0xc63aa388331f5016643dc4744dc47f0b79ac2dc30f2837f36058959de5c6d97b",
          "0xa1cdde08be62979fb2d51e3d1447e67ef9a72e7e9ad6c70834b6667ab4b25b2f",
          "0xeaf27f121d562cf7d6ba5fe04cb7477c2eae917f6ed0d254c474595334e1e61b",
          "0x4d3a2c0aa20291ec2a3e9663676770bb1cb1c33c8caa7308ec9b0e180df42039",
          "0x1f13065bd8d6bd0ff04592f8216576eb2ce38d766cf1fd4114392b4e622a7658",
          "0x220ce318063ac4496ba1e7946b78fd1574f95518ac920563531b124bbc3ec22d",
          "0x6c258638f3e25d325a1f73075a338ce02e57b4fac1b2a810a544d40b24e8b9f9",
          "0xa2a5fdce0672a32e04908e9a12a683697057855a33da8ab3cfc5275094f270fe",
          "0xfeb465bea0d19e832b87965440a36b3ea1d8bffda29d27ab72bf196f5a3954c0",
          "0x20b39aed43810bfc46a279f91e2814ae5a56906f7b7505c499850f2605c82dac",
          "0xd75f805748cdf37402c13b685d9dd9884ba1c0b0e3189f9f613a3a9ed223dbc8",
          "0x46bb82c63a8a2e29d01360f78d5ee871178847627774756ca6efc614c9710cee",
          "0x37a217624ca5724463612bc0a4f0943a3bf8599a05e9d4dc82da20bb0df79867",
          "0xca8ec3dfca0e43c79a9a32cdd8a01c161a8fbbed07d6f5b4231dc7b4086d1380",
          "0x12f7e01f6efcfb1c56bb3d4bf4358c32df847303c92d4f646996d4c601e1bd2f",
          "0x50a0a2e7abaeee10aa9ec6ca0303a019acd2b09279357a480fd37c2c03e177f1",
          "0x0c0134f6a1f68649f4777c86668ac2c3d348cd5ee9f71adaf5a783a3852a2e1c",
          "0x740fb5ab5762b25c2be2f3590cb0811d74b54dae5e40f52bf1e68c8fe2cb6e92",
          "0xa2218d513e2ca93a8acb3652d638af7be7e62711f48e81bf255fff3cfbe3a0dd",
          "0x413a7f87acffc04ef34261ae47737ab2f5f461d0af5d57269c5f6cdf78275159",
          "0x60d81ea9118a9d8075101f22e09d0646f155f23c2f4b84804f7ffc5afb203a68",
          "0x2ff7f513238717f264521c91bc457fb17800beda940eaf6d7e56b1c866b42c06",
          "0xda6dc1ae732e7ecbcac5765fc442fcee5a3617b5d575f5103b4fd9f706847c07",
          "0xf59ef60c1d9dda81fc22a8e985b6d3e589f512eb8b2518b3511a43908a460294",
          "0x81c6e17337cabd304c329a799b02e02245f37ece12a413f5c49282d18b1883cb",
          "0x18fb9299e78ffe36bfea65442d790288937a4d1d5b69138525dadaa70dc42367",
          "0x9db74bf461bb809717866699fb8b5d6bbe33b5bcc967dec46357331272e20df2",
          "0xc59eefbe4041f7dc7fdf2c86c9cfc0f1706993dcee80de6b27f25489cb8e10a9",
          "0x38b2207a133bfc3aec210fb386a199efb9087d13330fa0f637bfe37df59c312f",
          "0xd35ffbf38934b54a900e35c65c07fc3081993ebf5a55bc67977b73410abc211f",
          "0xa13e7a446c7f3ddaa8555c5d3437e8d827303b152a4dbb09ff01bde01a0585b0",
          "0x0bb1b3eea492459f2796fb9b3f7022417860f3a5450374220c0c9c3bd2e63512",
          "0xd9ebb04da1035f95bf3ed0bd06268f53737001f3f292ac825852875c57a6c4be",
          "0xe07cf18aa356d0134f2e0da6f68de7c9f28af854455fbdd38770b44be98a1dc6",
          "0x9be4c6c6a3c5622fcd0a1bbe13e21b8612eb39932f05b42972edf2ed184804dc",
          "0x9cf9a53f37175b3eba970af4b06a9fa98042e08882b2ed96dd285c0eaaa8e13c",
          "0x23f3b4e0dad22684741df92bba387be4e5c05414aca5bf54383e74a4b24b30eb",
          "0x4dcfcf6353596c9665fd94b7b9281b65e0a94b45f98ddff681db9ffc5c561602",
          "0x460b33043b87067727977ec7daea667bf440f482f0e77ab5a86745832c05d09e",
          "0x2fd8ab214c757b69349f10a86d94ccdae0a2c692f3408ea4d65bf5a58c710166",
          "0x6627f34e22dec201d70e4304375e60b0703a992610487356a7af6812c4ae89f0",
          "0x6a2ac6c7b4f140443ea9190beba68706aa0828055cc0a49c037f6bed4a3b94c9",
          "0xbadc35a3b5eb2524ddea54babbc6a7c531f94c845b499e2773f0d82f347976df",
          "0x258972ea1dced55b6b95ed07085de981786401d4da790000d7bd8739b0132cd9",
          "0x2b70ba122ab93b5b020a3e0ede3e5170d91b2fd8c429c4909b025a68e50a0a2a",
          "0xa1f2796fbf29d6cb19d541bb9e2ac1bdb8ecf4f64e9d4068a77b18325d736be8",
          "0x297b30d9b997e375d6d560c9670449c4ab9fc9e6cbfcfb094c659d053bd74fae",
          "0x4f2058432f7e90bde5ac4661e66dd4ddb4865a31a015b5da7a74f1ed682d4471",
          "0x88777368f2847a5a370cb5c6113b25841987168e1d60eff8f5e622b608c073b1",
          "0x4b6de4690fed6b924865cf234a94b74f8765c969d821bbddeb4333936c558aa9",
          "0x89db01005aa4cd9b60c481763f21dffe39a7ba2da6a4df80e1649fe71952ef70",
          "0x888b2ccb261734919308c792c458dcafbaf5ec09b35ff490b77e55304d8f6352",
          "0x847e03a9a940c74f151694bed14c82fc53eaaae5e4236e7f0525ab438f5e9d77",
          "0x176f3b0b49ee54ec554dc3a4dea00b3d115e48a8c0d5d3c6f328d7da8f6beff7",
          "0x009d634f81d6cbefe083d48d0741ab332f238bf496aafca838095e6fde0b541f",
          "0xaec2cd6a1cf8954187174f4a62c07b021293cac8b69d1b48cd206ba3244292ba",
          "0xc914a43546e51a0d4ab116e8fc86bd639c14b563474c9c247bb406404b6241c3",
          "0xdd7f4c16cc0512e308b521c944e11b852d652652656ba5c30589fbbd4454002d",
          "0x0329301ecb0cca138d687a07c3fc0e13358d10fb73f7ddac636fe1940d45be8b",
          "0x2f569a19dff21bc2674064a636b3f87689f3e0ed0ef69a0d99bbedb5721e154c",
          "0x06f42e2ae50574d560a495411ed504d3ca1c34ff5fe9f6f74a4327a9ada801f5",
          "0x04db2f50573f591543a42ad27ad89efe7182ff286b6d2c75e8787cdfd67682ad",
          "0xcac34907d292c7d1e8e307a3c669e9867977630b6667aa8ed0db0d0cb0e757f8",
          "0xe043631e0d3d42dfacb87783a95d9a7fb6d1b4a6b556ad5ffd9724dfec8a05dd",
          "0x163bd1073a5e99e886ae0ca8a469a58096e9992f772d8cf03c12897bc759ebf9",
          "0xe468530ce156f65bf52574d52c7b55489ae9a4a7bc3df7710e3ef8fd47d72386",
          "0xc19059a3d7e5f89c1bd674b798c5ff3860748acd9ccb7d684785358bc5a12d20",
          "0x73f819dd32e6679910453dafe4976b5724749fcd18407078e46864a22e47181d",
          "0xfe592761d1dc1bd893e0f8fdc548eaa3f5b441fda87ee71826d2d498a19b1f33",
          "0x291c84340609f89adc913f236425e23792af8728f6320f5e67f936384e02debc",
          "0x48aafb002e34c51e578c57e780ef52676301c44ce359c943238e56188c9be970",
          "0xb3790060ee3927e51a8415bf742287ed54fefd32e8e5e0e6e6d8327504f67e3f",
          "0x3fb1be8cec3734f7f261eee9bb67e16f89bd5e3836822cb30b79c3661fbbe00e",
          "0x32ca794db2e8bb3a6ce2fee48506541397112c3deea2dfe46deeae71ee9f663a",
          "0x81dc670fb945eb8c35b00b50f015fd9cef8c4560a855563364d01f2ef4508e14",
          "0xbd6556b6d46cca1b2b17a19a3a59c240b0ef3cf48a64dec4d3998c9cc24c1a8e",
          "0x90ad6135bfdf67e34c8f73238d31cc0986af1cb489bcfe81fc3eee05d9c29b97",
          "0x6e1cb115a90aabc2808bc7322acd7b3c34545f4aa8038f5c6d730da941c2e676",
          "0xf3f3af837c7e33b56008a0c04e8ab247210934cb6f3c5067e3a7a37f3e5dafe1",
          "0xc9d4ceee42f0ec528c1a63eb9d44098fd23beeedba9604f9e083afb2d505fdef",
          "0x17e4dea18b087b93f1215bcfad045ec54713658ebc484fe4e8986a771b0852a9",
          "0xfb649abb7e83c2cd08e1e30f0604d06186e3d34901206b1d4c409b26b0510d08",
          "0xcf248cf3701057459fc2347f9a9c3dc75332df6cfe002a8befe950ec2aa41b8c",
          "0xe355fea96b01d1f58a9ad11787f347ab05da938b8ae8355fb4a4811c1791ddf2",
          "0xf41a9728a3c5beb95bd54d48781fc5989608892c59cdf58545787581d7ef86a3",
          "0x974a1c129883d3d47d8faaae93cb8a0559b095ec5440f2e876b1ee12588be268",
          "0x7902398372de025e2a389ab30720d9219a48e0c843800fe2a117870b8588514e",
          "0x3858c51d5edd299685ce0ac9aa398d572eba7a25afe941580e9ff281f3ef4b96",
          "0x1a1a0c85194c4ceba80a6266fd6cf9977ace734c0bbe36fdb3f3b14fe185dbfc",
          "0xfc0faddbc7dfa5939e91d6759c1a58bc8fb19ee24fb19aa31d05cbf8cada3cf2",
          "0x99a9b35bfa30a6546895c6d134041b1564f7d404693619cf94fd6d5087559c2e",
          "0x9689c75b7fa465187f1723e96ae4a1092f6f6aa86e187882acced16882682e46",
          "0x70c6c50149f0bc6fd7c685bc9fab53dfd3f484a3c9bf206578951684a7e78d22",
          "0x1c2b3e1326bc24046d45e3c626ce5e865e9f0f4807f129994558caeccc7e4c40",
          "0x41491514a58d6db155b09d99c21e935f60aabdcb0b2bfd0ac3c7a66add88c8dc",
          "0x120d2916730adbd56c3a6fd6fd4618af561c81b73952b9f247ebd6fb0d253a01",
          "0xc65bb3d2984276ad902ed5d790cdbc5cfb953d5ff01dd0790532b2214dfb2f78",
          "0xbdf1cf02af245b580cf20f728fddfa39c6eb5b0ed70e0487c1074fbf28ebc0b0",
          "0xcbd578f01e8b5feba2ab69487c979e551c33ce2b73902c63943df9945dd23b9b",
          "0xc8c42876c9f093326fd24262be17af1ec0a1030693f7e4a24201c28b3b90d82c",
          "0x0b8839b2d0aa101cc2e8887c2d20c83d813559e7800f7ad9ce9af8be697a9a18",
          "0xf621df816c070c7f0091dda13b34e6a46a7a86dab6852500351d4f5e2ae9eefe",
          "0x8418a842e94ae25f54f427b389cee45d06da8cd3f55e41be9332c56241d48962",
          "0xac58a960f5db3cc0570a20f8ca307ef444d9a90f630c7b629e66e4313aad45b3",
          "0xf66d09329c4db75279f910ebe6d7a1c643632668a711dfb8069f47cf00d7a57a",
          "0xdcacf0e0951030d0f733cbbb46b5f0b3b45840953525b757001ceb74bae9fa4b",
          "0x941e10e4fde951acfbc184d76a51823b6ab04214b297e7e52bee236d8f66b8b9",
          "0xd1dd9fbed648c9d93f590a91ef9922b6256878a498e61055d8fec739395ce0e9",
          "0xe7eae47cd583cab13d7d684adc6e443ef38d83c7d2120171eecf7b0c9168a77b",
          "0x08a6ff7d42b3056bc571e9c16607b373d37565a71cac95b9a85bf5788f08ea0d",
          "0x3bae2e6ec6af9bbffe37b395df67769b234cdd743bd848764420ff2799ea673c",
          "0xaa0b772f59055d8dfbef446352b2d08fbacd97968643a300e03e520c50ffdcbf",
          "0xd8d29dfd14ab5068e615662b3580d191663f64cc15557873194d7b2718dc0425",
          "0x0561ae8390935eece56ca93e3ea5feaa187e3777418fc19134649726c9519f41",
          "0xe3c8dc3145997086caf05a06d4209d10096df09379fce4819f40c13cad005d3e",
          "0x02d87b27d2a9e5cb47a71051ef0ef3202e2a86373807753e8603807e43ecf4f5",
        ],
        "transactionsRoot": "0xec75fee6c90538b6b5d846f5fd25f550591eaccbb366fc393c4a693f8370d0b4",
        "uncles": [],
        "withdrawals": [
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11cdffd",
            "index": "0x2b3aa2b",
            "validatorIndex": "0x36315",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11bee1f",
            "index": "0x2b3aa2c",
            "validatorIndex": "0x36316",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c8a4c",
            "index": "0x2b3aa2d",
            "validatorIndex": "0x36317",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11bfb57",
            "index": "0x2b3aa2e",
            "validatorIndex": "0x36318",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11becdc",
            "index": "0x2b3aa2f",
            "validatorIndex": "0x36319",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c0882",
            "index": "0x2b3aa30",
            "validatorIndex": "0x3631a",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c12c5",
            "index": "0x2b3aa31",
            "validatorIndex": "0x3631b",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11caadf",
            "index": "0x2b3aa32",
            "validatorIndex": "0x3631c",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c47d5",
            "index": "0x2b3aa33",
            "validatorIndex": "0x3631d",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x3c9a1eb",
            "index": "0x2b3aa34",
            "validatorIndex": "0x3631e",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c1404",
            "index": "0x2b3aa35",
            "validatorIndex": "0x3631f",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c22d9",
            "index": "0x2b3aa36",
            "validatorIndex": "0x36320",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11c2dab",
            "index": "0x2b3aa37",
            "validatorIndex": "0x36321",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11bfdf6",
            "index": "0x2b3aa38",
            "validatorIndex": "0x36322",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11bafb3",
            "index": "0x2b3aa39",
            "validatorIndex": "0x36323",
          },
          {
            "address": "0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f",
            "amount": "0x11b9154",
            "index": "0x2b3aa3a",
            "validatorIndex": "0x36324",
          },
        ],
        "withdrawalsRoot": "0x3f196863f2d0d52b020c33d1ac2fb588f257ac153baa09fbee2cc1cce42fadef",
      }
    `)
  })

  test('args: includeTransactions', async () => {
    const block = await getBlock(client, {
      blockNumber: anvilMainnet.forkBlockNumber,
      includeTransactions: true,
    })
    expect(typeof block.transactions[0] === 'object').toBe(true)
  })
})

test('non-existent block: throws if block number does not exist', async () => {
  await expect(
    getBlock(client, {
      blockNumber: 69420694206942n,
    }),
  ).rejects.toMatchInlineSnapshot(`
    [BlockNotFoundError: Block at number "69420694206942" could not be found.

    Version: viem@x.y.z]
  `)
})

test('non-existent block: throws if block hash does not exist', async () => {
  await expect(
    getBlock(client, {
      blockHash:
        '0xd4a8cf1bf4d05f44480ae4a513d09cddb273880ed249168bf2c523ee9e5c7722',
    }),
  ).rejects.toMatchInlineSnapshot(`
    [BlockNotFoundError: Block at hash "0xd4a8cf1bf4d05f44480ae4a513d09cddb273880ed249168bf2c523ee9e5c7722" could not be found.

    Version: viem@x.y.z]
  `)
})
