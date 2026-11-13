# Watchface apps

Four watchfaces ship under `apps/`:

| App          | Design                                                   |
| ------------ | -------------------------------------------------------- |
| `hands`      | Analog hour/minute hands                                 |
| `minimalism` | Hour/minute dots on a ring with centered heart rate/time |
| `maximalism` | 12-hour dot ring, minute marker, battery + heart rate    |
| `timezones`  | Stacked London, local/Saigon, and Melbourne times        |

Each app has its own `manifest.xml`, `monkey.jungle`, `resources/`, and
`*View.mc`/`*App.mc` files, so it can be built and run independently of the
others.
