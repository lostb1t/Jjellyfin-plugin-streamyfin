## Companion app for [Streamyfin](https://github.com/fredrikburmester/streamyfin)
t
Allows centralised configuration of Streamyfin.

Config example:

```yaml
# You can remove any settings you do not need configured.

# Format Example
# settingName:
#   locked: true | false # if true, locks the setting from modification in app. Default false.
#   value: value # Value you want the setting to be. Editor will give you type suggestion for a specific setting.

# Example below shows all supported settings at this time.
settings:
  # Media Controls
  forwardSkipTime:
  rewindSkipTime: 

  # Audio Controls
  rememberAudioSelections:
  
  # Subtitles
  subtitleMode:
  rememberSubtitleSelections:
  subtitleSize:
  
  # Other
  autoRotate:
  defaultVideoOrientation:
  safeAreaInControlsEnabled:
  showCustomMenuLinks:
  hiddenLibraries:
  disableHapticFeedback:
  
  # Downloads
  downloadMethod:
  remuxConcurrentLimit:
  autoDownload:
  optimizedVersionsServerUrl:

  # Jellyseerr 
  jellyseerrServerUrl:
  
  # Search
  searchEngine:
  marlinServerUrl:

  # Popular Lists
  usePopularPlugin:
  mediaListCollectionIds:

  # Misc.
  libraryOptions:
```

#### Supported Streamyfin App configurations
[Settings.cs](Jellyfin.Plugin.Streamyfin/Configuration/Settings/Settings.cs)

repo url: https://raw.githubusercontent.com/streamyfin/jellyfin-plugin-streamyfin/main/manifest.json

### Create release

- bump version in makefile
- run `make release`
- commit and push changes made release script