/*
 * Vencord, a Discord client mod
 * Zeons edition
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findOption, OptionalMessageOption } from "@api/Commands";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
// @see https://github.com/dysfunc/ascii-emoji/blob/master/emojis
const more_emojis = `
4chan-emoticon:( ͡° ͜ʖ ͡°)
angry-birds:( ఠൠఠ )ﾉ
angry-face:(╬ ಠ益ಠ)
angry-troll:ヽ༼ ಠ益ಠ ༽ﾉ
at-what-cost:ლ(ಠ益ಠლ)
barf:(´ж｀ς)
basking-in-glory:ヽ(´ー｀)ノ
boxing:ლ(•́•́ლ)
breakdown:ಥ﹏ಥ
careless:◔_◔
cheers:（ ^_^）o自自o（^_^ ）
chicken:ʚ(•｀
confused-scratch:(⊙.☉)7
confused:¿ⓧ_ⓧﮌ
crazy:ミ●﹏☉ミ
creeper:ƪ(ړײ)‎ƪ​​
cry-face:｡ﾟ( ﾟஇ‸இﾟ)ﾟ｡
crying-face:ಥ_ಥ
cry-troll:༼ ༎ຶ ෴ ༎ຶ༽
cute-bear:ʕ•ᴥ•ʔ
cute-face-with-big-eyes:(｡◕‿◕｡)
dab:ヽ( •_)ᕗ
dance:♪♪ ヽ(ˇ∀ˇ )ゞ
dancing:┌(ㆆ㉨ㆆ)ʃ
dear-god-why:щ（ﾟДﾟщ）
devious-smile:ಠ‿ಠ
disagree:٩◔̯◔۶
discombobulated:⊙﹏⊙
dislike:( ಠ ʖ̯ ಠ)
double-Flip:┻━┻ ︵ヽ(\`Д´) ﾉ︵﻿ ┻━┻;
do -you - even - lift - bro ?: ᕦ(ò_óˇ)ᕤ
emo - dance: ヾ(-_ - )ゞ;
excited:☜(⌒▽⌒)☞
exorcism: ح(•̀ж•́)ง †
eye - roll:⥀.⥀
feel - perky: (\`･ω･´)
fido:V•ᴥ•V
fight:(ง̀-́)ง
fisticuffs:ლ(｀ー´ლ)
flexing:ᕙ(⇀‸↼‶)ᕗ
flip-friend:(ノಠ ∩ಠ)ノ彡( \\o°o)\\
fly-away:⁽⁽ଘ( ˊᵕˋ )ଓ⁾⁾
flying:ح˚௰˚づ
fuck-it:t(-_-t)
fuck-off:(° ͜ʖ͡°)╭∩╮
GTFO-Bear:ʕ •\`ᴥ•´ʔ;
happy - face: ヽ(´▽\`)/
happy-hug:\\(ᵔᵕᵔ)/
hitchhiking:(งツ)ว
hugger:(づ￣ ³￣)づ
im-a-hugger:(⊃｡•́‿•̀｡)⊃
injured:(҂◡_◡)
innocent-face:ʘ‿ʘ
japanese-lion-face:°‿‿°
judgemental:{ಠʖಠ}
judging:( ఠ ͟ʖ ఠ)
kirby:⊂(◉‿◉)つ
kissing:( ˘ ³˘)♥
kitty-emote:ᵒᴥᵒ#
listening-to-headphones:◖ᵔᴥᵔ◗ ♪ ♫
looking-down:(._.)
love:♥‿♥
love:-\`ღ´-
meh:¯\\(°_o) /¯
meow: ฅ ^•ﻌ•^ ฅ;
no - support: 乁( ◔ ౪◔)「      ┑(￣Д ￣)┍
opera: ヾ(´〇\`)ﾉ♪♪♪
peepers:ಠಠ
pointing:(☞ﾟヮﾟ)☞
pretty-eyes:ఠ_ఠ
put-the-table-back:┬─┬﻿ ノ( ゜-゜ノ)
questionable:(Ծ‸ Ծ)
reddit-disapproval-face:ಠ_ಠ
resting-my-eyes:ᴖ̮ ̮ᴖ
robot:{•̃_•̃}
running:ε=ε=ε=┌(;*´Д\`)ﾉ
sad-and-confused:¯\\_(⊙︿⊙)_/¯
sad-and-crying:(ᵟຶ︵ ᵟຶ)
sad-face:(ಥ⌣ಥ)
satisfied:(◠﹏◠)
seal:(ᵔᴥᵔ)
shark-face:( ˇ෴ˇ )
shrug-face:¯\\_(ツ)_/¯
shy:(๑•́ ₃ •̀๑)
sleepy:눈_눈
smiley-toast:ʕʘ̅͜ʘ̅ʔ
squinting-bear:ʕᵔᴥᵔʔ
staring:٩(๏_๏)۶
stranger-danger:(づ｡◕‿‿◕｡)づ
strut:ᕕ( ᐛ )ᕗ
stunna-shades:(っ▀¯▀)つ
surprised:（　ﾟДﾟ）
table-flip:(╯°□°）╯︵ ┻━┻
taking-a-dump:(⩾﹏⩽)
tgif:“ヽ(´▽｀)ノ”
things-that-cant-be-unseen:♨_♨
tidy-up:┬─┬⃰͡ (ᵔᵕᵔ͜ )
tired:( ͡ಠ ʖ̯ ͡ಠ)
touchy-feely:ԅ(≖‿≖ԅ)
tripping-out:q(❂‿❂)p
trolling:༼∵༽ ༼⍨༽ ༼⍢༽ ༼⍤༽
wave-dance:~(^-^)~
whistling:(っ•́｡•́)♪♬
winnie-the-pooh:ʕ •́؈•̀)
winning:(•̀ᴗ•́)و ̑̑
wizard:(∩｀-´)⊃━☆ﾟ.*･｡ﾟ
worried:(´･_･\`)
yum:(っ˘ڡ˘ς)
zombie:[¬º-°]¬
zoned:(⊙_◎)`.split("\n").filter(Boolean);

export default definePlugin({
    name: "MoreKaomoji",
    description: "Adds more Kaomoji to discord. ヽ(´▽`)/",
    authors: [Devs.JacobTm],
    dependencies: ["CommandsAPI"],
    commands: [
        { name: "dissatisfaction", description: " ＞﹏＜" },
        { name: "smug", description: " ಠ_ಠ" },
        { name: "happy", description: " ヽ(´▽`)/" },
        { name: "crying", description: " ಥ_ಥ" },
        { name: "angry", description: " ヽ(｀Д´)ﾉ" },
        { name: "anger", description: " ヽ(ｏ`皿′ｏ)ﾉ" },
        { name: "joy", description: " <(￣︶￣)>" },
        { name: "blush", description: "૮ ˶ᵔ ᵕ ᵔ˶ ა" },
        { name: "confused", description: "(•ิ_•ิ)?" },
        { name: "sleeping", description: "(ᴗ_ᴗ)" },
        { name: "laughing", description: "o(≧▽≦)o" },
        ...more_emojis.map(emoji => ({
            name: emoji.split(":")[0],
            description: emoji.split(":")[1]
        })).filter(e => e.name)
    ].map(data => ({
        ...data,
        options: [OptionalMessageOption],
        execute: opts => ({
            content: findOption(opts, "message", "") + data.description
        })
    }))
});
