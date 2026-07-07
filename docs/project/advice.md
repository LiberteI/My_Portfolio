# Project Gallery 场景优化分析

本文对当前 Three.js 场景与目标概念图进行对比分析，并总结需要优化的方向。

总体来说，目前的场景已经具备了不错的基础：

- 极简的现代美术馆空间
- 投影仪与幕布的位置合理
- 光照方向正确
- 整体氛围偏电影感

但是目前仍然更像是：

> **一个摆着投影仪的房间（Room with a projector）**

而目标图更像是：

> **一场围绕投影内容设计的数字艺术展（Digital Exhibition）**

两者最大的区别并不是模型质量，而是 **Lighting、Composition、Visual Hierarchy、Atmosphere**。

---

# 1. 让投影内容成为视觉中心（Hero）

## 当前问题

目前整个场景最亮的位置其实是：

- 投影仪底座
- 地面的灯光
- 墙面的SpotLight

真正的Screen反而没有任何存在感。

用户第一眼不会看向Projection，而是会先看到投影仪。

整个视觉重心是错误的。

---

## 目标效果

真正应该成为视觉中心的是：

```
Projector
        ↓
Projection Beam
        ↓
Projected UI
```

投影内容应该是整个房间最亮、最吸引人的地方。

用户进入页面后，视线应该立刻落到展示的Project，而不是房间本身。

---

## 优化建议

- 提高投影画面的亮度
- 提高UI对比度
- Screen增加Emissive
- 后期Bloom只作用于Projection

---

# 2. 让幕布真正“发光”

## 当前问题

目前Screen更像：

> 墙上的一块白板

它只是被灯照亮。

并没有任何"自己正在发光"的感觉。

---

## 目标效果

现实中的投影幕布虽然不是光源，但在人眼看来，它就是房间最亮的物体。

应该让用户感觉：

> 这个房间，是被屏幕照亮的。

---

## 优化建议

Screen可以增加：

- Emissive Material
- Bloom
- Slight Exposure
- HDR Brightness

这样Screen会有轻微发光效果，而不会像LED电视一样刺眼。

---

# 3. 改善墙面的受光方式

## 当前问题

目前墙面的亮度来自：

```
SpotLight
↓

圆形热点
```

因此整个墙面更像：

> 被聚光灯照射

而不是：

> 被投影内容照亮。

---

## 目标效果

投影仪真正照亮的是：

- Projection
- Projection周围墙面
- Screen边缘

整个亮度应该从Screen自然向四周衰减。

而不是墙中心出现一个SpotLight Hotspot。

---

## 优化建议

- Projection周围增加柔和Bounce Light
- 使用RectAreaLight模拟屏幕发光
- Surrounding Wall做渐变亮度

---

# 4. 投影光束（Beam）需要更真实

## 当前问题

目前Beam：

- 边缘过于锐利
- 完全均匀
- 像一个透明三角形

比较像：

```
Geometry
```

而不是：

```
Light
```

---

## 目标效果

真实投影光束几乎看不见。

只有空气中的灰尘会让它变得可见。

Beam应该具有：

- Soft Edge
- Noise
- Distance Fade
- Dust Particle
- Volumetric Feeling

整个Beam应该越靠近Projector越亮。

越靠近Screen越柔和。

---

# 5. 提高整体对比度（Contrast）

## 当前问题

目前整个房间：

- 墙
- 地面
- 投影仪
- 幕布

亮度都比较接近。

没有真正的视觉重心。

---

## 目标效果

整个画面的亮度应该形成层级：

```
Projection（最亮）

↓

Beam

↓

Projector

↓

Floor

↓

Background
```

这样用户第一眼就知道哪里最重要。

---

# 6. 材质表现（Material Response）

## 当前问题

目前墙面材质比较平。

灯光照上去之后：

没有太多细节。

---

## 目标效果

灯光应该能够展示材质本身。

例如：

墙面：

- Roughness Map
- Normal Map
- AO

地面：

- Slight Reflection
- Rough Reflection
- Light Bounce

这样即使没有增加模型复杂度，整个画面也会丰富很多。

---

# 7. 地面需要参与光照

## 当前问题

目前Floor几乎没有回应Projection。

整个空间感觉比较"死"。

---

## 目标效果

地面应该轻微反射：

- Projection
- Beam
- Projector

注意：

不是镜面。

只是：

```
Very Soft Reflection
```

即可。

这样整个空间会自然很多。

---

# 8. 色调（Color Grading）

## 当前问题

目前颜色偏中性。

整体略微偏灰。

---

## 目标效果

目标图整体更偏：

暖白色

电影感

Museum Lighting

推荐：

- ACES Filmic
- Exposure提升一点
- Warm White Projector
- Warm Shadow

整体观感会高级很多。

---

# 9. 增加空间层次（Depth）

## 当前问题

目前场景主要只有：

```
Wall

↓

Projector
```

视觉层数太少。

---

## 目标效果

目标图实际上拥有很多层：

```
Background Wall

↓

Projection

↓

Projection Beam

↓

Projector

↓

Project Cards

↓

HUD

↓

Mouse
```

大量层次会让整个画面更有空间感。

---

# 10. 增加 Micro Lighting（细节高光）

目标图其实充满了很多不起眼的小亮点。

例如：

- Projector边缘
- 底座顶部
- Screen边框
- Card边缘Glow
- Navigation小圆点
- Logo

这些细节不会抢眼。

但是会让整个Scene显得十分精致。

---

# 11. Camera Composition

目前Camera偏保守。

左侧和地面留白较多。

虽然留白能够突出极简风格，但目前略显空旷。

可以考虑：

- Camera略微Closer
- 减少Floor占比
- 使用Rule of Thirds重新调整Projection位置
- 让Beam形成更强的Leading Line

进一步强化视觉引导。

---

# 12. 增加空气感（Atmosphere）

目标图最容易忽略的一点就是：

空气。

Beam不是漂浮在真空里。

而是在空气中传播。

因此建议增加：

- Volumetric Fog
- Floating Dust
- Animated Noise
- Bloom Interaction

这些效果会让整个Scene更有生命力。

---

# 13. Screen本身需要更有质感

目前Screen只有一圈细线。

可以考虑：

- 极细铝合金边框
- 投影幕布材质
- Matte Surface
- 柔和边缘Glow

让Screen本身成为一个真实存在的物体，而不是一块矩形Plane。

---

# 14. 后期处理（Post Processing）

目标图的大部分高级感来自后期，而不是模型。

推荐开启：

- ACES Filmic Tone Mapping
- Physically Correct Lights
- Bloom
- HDR Environment
- SMAA / TAA
- 轻微Vignette
- （可选）极弱Chromatic Aberration

这些都会明显提升最终观感。

---

# 优化优先级

## ⭐⭐⭐⭐⭐ 第一优先级（影响最大）

- 将真实Project页面投影到Screen
- 让Screen成为整个房间最亮的位置
- 增加Bloom
- 优化Projection Beam
- 调整整体视觉重心

---

## ⭐⭐⭐⭐ 第二优先级

- 墙面Bounce Light
- Tone Mapping
- Material Roughness
- Floor Reflection
- Warm Color Grading

---

## ⭐⭐⭐ 第三优先级

- Dust Particle
- Volumetric Fog
- Projector细节灯光
- Camera微调
- Screen材质优化

---

# 最终目标

最终希望达到的效果不是：

> **一个放着投影仪的Three.js场景。**

而是：

> **一个数字艺术展厅（Digital Exhibition），整个空间都围绕Projection展开。**

当用户进入页面时，视线会自然沿着：

```
Projector
    ↓
Projection Beam
    ↓
Projected Project
    ↓
Project Cards
```

完成整个浏览流程。

整个空间应该服务于内容，而不是抢夺内容的注意力。所有灯光、材质、后期和构图，都应该共同强化这一视觉叙事，让用户第一眼就意识到：**真正的主角不是房间，而是正在被展示的作品。**