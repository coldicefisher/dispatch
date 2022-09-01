''' These are my machines '''
print (__name__)
class Machine:
    def __init__(self, items: int, cost: float):
        self.__items = items
        self.__cost = cost

    @property
    def items(self) -> int:
        return self.__items
    @property
    def cost(self) -> float:
        return self.__cost

    def buy(self, num_items: int, money: float):
        if num_items > self.items: raise ValueError('Not enough items in the machine!')

        how_much = num_items * self.cost
        change = how_much - money
        if change < 0: raise ValueError('You need more money!')
        self.__items -= num_items
        return change

