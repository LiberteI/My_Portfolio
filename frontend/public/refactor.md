current problem:

- images under `public/images` and `src/assets` are messy
- naming is not consistent
- folder names are not descriptive enough
- image hierarchy is not consistent
- route-specific assets and shared UI assets are mixed together
- texture images are spread across too many places
- icons such as language icons, framework icons, company icons, and social icons are not clearly separated
- interaction hint icons are mixed with language or technology icons

current goals:

1. propose a clearer structure tree
2. keep compressed images under their corresponding raw image folder
3. fix naming and hierarchy inconsistencies
4. define the responsibility boundary between `public` and `src/assets`

ideal compressed-image hierarchy:

- compressed images should live under the same content folder as their raw source images
- this keeps source and derived files close to each other
- this makes replacement, optimization, and auditing easier

example:

```text
icons
  icon-1.png
  icon-2.png
  icon-3.png
  compressed-img
    icon-1.webp
    icon-2.webp
    icon-3.webp
```

proposed structure tree:

```text
public/images
  branding
    logo.png
    logo-dark.png
    compressed-img
      logo.webp
      logo-dark.webp

  home
    layers
      moon.png
      sky.png
      sky-loop.png
      building-far.png
      building-mid-far.png
      building-mid-near.png
      building-near.png
      foreground.png
      tile.png
      compressed-img
        moon.webp
        sky.webp
        sky-loop.webp
        building-far.webp
        building-mid-far.webp
        building-mid-near.webp
        building-near.webp
        foreground.webp
        tile.webp

  language-icons
    js.png
    typescript.png
    python.png
    java.png
    cpp.png
    csharp.png
    css-html.png
    glsl.png
    compressed-img
      js.webp
      typescript.webp
      python.webp
      java.webp
      cpp.webp
      csharp.webp
      css-html.webp
      glsl.webp

  ui-icons
    click.webp
    compressed-img
      click.webp

  company-icons
    dal-logo.png
    dmls-logo.png
    curioseed-logo.png
    compressed-img

  framework-icons
    react.png
    node.png
    firebase.png
    mongodb.png
    unity.png
    unreal.png
    android-studio.png
    opengl.png
    sql.png
    n8n.png
    musescore.png
    compressed-img
      react.webp
      node.webp
      firebase.webp
      mongodb.webp
      unity.webp
      unreal.webp
      android-studio.webp
      opengl.webp
      sql.webp
      n8n.webp
      musescore.webp

  dev-tool-icons
    git.png
    github.png
    gitlab.png
    postman.png
    compressed-img
      git.webp
      github.webp
      gitlab.webp
      postman.webp

  social
    email.png
    github.png
    google.png
    linkedin.png
    youtube.png
    compressed-img
      github.webp
      google.webp
      linkedin.webp
      youtube.webp

  music
    music-header.jpeg
    fire-streak.gif
    compressed-img

  project-thumbnails
    knight-thumbnail.png
    bubble.png
    agent.png
    dal-tutor.png
    ice-spy.png
    portfolio.png
    supervised-learning.png
    compressed-img
      knight-thumbnail.webp
      bubble.webp
      agent.webp
      dal-tutor.webp
      ice-spy.webp
      portfolio.webp
      supervised-learning.webp

  project-projections
    knight-thumbnail.png
    bubble.png
    agent.png
    dal-tutor.png
    ice-spy.png
    portfolio.png
    supervised-learning.png
    compressed-img
      knight-thumbnail.webp
      bubble.webp
      agent.webp
      dal-tutor.webp
      ice-spy.webp
      portfolio.webp
      supervised-learning.webp

  project-previews
    astronomy.gif
    ocean.gif
    shape-morphing.gif

  fallback
    garry.jpeg
    ruiyang-su.jpeg
    vikrant.jpeg
    compressed-img
      garry.webp
      ruiyang-su.webp
      vikrant.webp

  ui-textures
    paper-texture.jpg
    corner-ornament.svg
    compressed-img
      paper-texture.webp

src/assets
  scene
    meshes
    textures
      museum
      resume
    animations
```

public vs src/assets:

`public/images` should contain:

- static images used directly by normal pages
- assets referenced by string paths such as `/images/...`
- content-oriented images for UI, thumbnails, icons, and page backgrounds

examples:

- home parallax background layers
- project thumbnails
- project projection images
- social icons
- branding
- fallback avatars
- music page images

`src/assets` should contain:

- scene-specific assets imported directly into code
- assets that belong tightly to a component or system
- Three.js textures, meshes, and imported animation resources

examples:

- `Meshes/`
- `Museum/`
- `resume.png`
- scene-specific gifs or imported animation assets

decision rule:

- if the asset behaves like website content, put it in `public/images`
- if the asset behaves like a code dependency, put it in `src/assets`

naming rules:

- use lowercase kebab-case for filenames and folders
- include content meaning before variant
- keep raw and compressed versions on the same basename whenever possible
- if compression state is already expressed by folder, do not repeat it in the filename unless needed

examples:

- `moon.png`
- `sky-loop.webp`
- `project-knight-thumbnail.webp`
- `project-knight-projection.webp`
- `paper-texture.webp`

notes:

- `compressed-img` is acceptable as a folder name if it is used consistently everywhere
- the main issue is not the idea of compression folders
- the real issue is inconsistent grouping, inconsistent naming, and unclear ownership between `public` and `src/assets`

target outcome:

- every image folder should describe content purpose clearly
- every compressed asset should sit close to its raw source asset
- raw page content and scene-specific imported assets should no longer be mixed
- naming and lookup should become predictable
