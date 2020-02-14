# OvationTix Events Widget
A WordPress plugin that displays ticketed events from the UCF School of Performing Arts using the OvationTix REST API. 

## How to Use This Plugin
This plugin is employed through the shortcode `[ovation]`. It has a few options that the user can configure, which are:

* `format`: The particular look you'd like for the feed. The plugin supports three formats: `card`, which displays them in a horizontally-aligned scroll box; `thumb`, which displays a vertically-oriented list with thumbnail images; and `plaintext`, which looks much like the thumbnail list but is text-only. Default is `card`.
* `blurb`: Whether to include a brief description of the event, which the app generates from the longer description. Only affects the `card` format, from the above option. Default is `false`.
* `filter`: A space-delimited list of keywords that correspond to the various classifications of OvationTix events from SPA. Defaults to showing all categories. Options include:
  * `theatre`: Displays Theatre UCF events.
  * `music`: Displays UCF Music events.
  * `gallery`: Displays UCF Art Gallery events.
  * `visual`: Displaycs UCF School of Visual Arts and Design (SVAD) events. If used on its own, will also include events from the gallery, but not *vice versa*.
  * `celebrates`: Displays events that are a part of the annual UCF Celebrates the Arts event.


