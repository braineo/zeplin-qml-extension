# Zeplin QML Extension

This plugin generates code for QML

[Zeplin](https://zeplin.io) extension that generates sample snippets.

## Getting started

Add the extension to your project from extensions.zeplin.io.

## Output

```qml
Rectangle {
    width: 464
    height: 510
    radius: 4
    border {
        width: 2
        color: "#ffbb18"
    }
}
```

``` qml
Text {
    text: qsTr(example text for plugin')
    color: "#ffffff"
    font.pixelSize: 14
    wrapMode: Text.WordWrap
    elide: Text.ElideRight
}
```

## Options

#### Resize function name

Name of function to apply to size, width, height.

#### Use linked style guide

Display resources from linked and parent style guides.

#### Style guide namespace

QML name space of style guide. A prefix to color names etc.

#### Text i18n option

If enabled, will wrap text into `qsTr('text')` or `qsTrId('text-id')`

## Development

This extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a command line tool that lets you quickly create, test and publish extensions.

To learn more about creating Zeplin extensions, [see documentation](https://github.com/zeplin/zeplin-extension-documentation).
