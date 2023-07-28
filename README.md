# Canvas Test

## Pure Canvas Performance

1. redraw on action

- Failing point for Laptop(M1 Mac)
    - square: 35,000
    - text: 45,000
    - 45-degree rotated square: 9,500
    - 45-degree rotated text: 8,500

- Failing point for SmartPhone(IPhone11)
    - square: 6,000
    - text: 2,500
    - 45-degree rotated square: 1,500
    - 45-degree rotated text: 13,00

2. redraw with interval(with or without redraw flag)

- Failing point for Laptop(M1 Mac)
    - square: 120,000
    - 45-degree rotated square: 40,000

- Failing point for SmartPhone(IPhone11)
    - square: 10,000
    - 45-degree rotated square: 3,500