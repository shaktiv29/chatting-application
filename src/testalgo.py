class Stack():
    def __init__(self) -> None:
        self.stackarr = []
    def push(self,x):
        self.stackarr.append(x)
    def pop(self):
        return self.stackarr.pop()
    def peek(self):
        return self.stackarr[-1]
    def showarray(self):
        return self.stackarr
    def is_empty(self):
        return (len(self.stackarr)==0)

def is_match(x,y):
    if x == '(' and y ==')':
        return True
    if x == '{' and y =='}':
        return True
    if x == '[' and y ==']':
        return True
    else:
        return False

def parethess(num):
    s = Stack()
    bin = ''
    while num!=0:
        s.push(str(num%2))
        num = int(num/2)
    while not(s.is_empty()) :
        bin += s.pop()
    return int(bin)
    

print(parethess(20))