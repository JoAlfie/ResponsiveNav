# Responsive Nav (needs a cool name)

Use one set of markup for a drawer navigation on mobile and a navigation bar on desktop!
Accessible - uses semantic HTML5, aria, and focus management.

## Options

| Property          | Type          | Default        | Description                                                                                                                                    |
| ----------------- | ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| dataPrefix        | string        | "data-respnav" | data-_ attribute used on `<nav>` element, and the prefix for the data-_ attribute used for other elements                                      |
| breakpoint        | number / bool | 768            | Window pixel width below which the drawer navigation is active. Set to false to use drawer navigation all the time.                            |
| animationDuration | number        | 500            | Match to transition time for any open / close CSS animation - stops animation being cut short by the drawer navigation being set to `[hidden]` |
| hasChildLists     | bool          | false          | Set true if navigation `<li>`s have child `<ul>`s                                                                                              |
| childListSelector | string        | ""             | Set if hasChildLists is true - selector for the child lists, e.g. `".navlist--child"`                                                          |
