
inputTape = '#'

class Program:
    def __init__(self, states):
        self.states = {}
        self.tape = [] 
        self.tapePointer = 0
        self.currentState = 1
        self.actionLogs = []
        self.tapeLogs = []
        for state in states:
            self.states[int(state['stateNumber'])] = state
    
    def actionLog(self):
        state = self.states[self.currentState]
        action = state['action']
        value = state['value']
        print(action, value)
        self.actionLogs.append(state)

    def tapeLog(self):
        print(self.getTapeString())
        self.tapeLogs.append(self.getTapeString())

    def getLogs(self):
        logs = []
        for i in range(0, len(self.actionLogs)):
            logs.append({
                'action': self.actionLogs[i],
                'tape': self.tapeLogs[i]
            })
        return logs

    
    def getTapeString(self):
        # def convert(i):
        #     if(i > 0):
        #         return str(i)
        #     else:
        #         return '#'
        # stringTape = '#' + '#'.join([convert(i) for i in self.tape]) + '#'
        stringTape = ''
        for i in range(0,len(self.tape)):
            if(self.tape[i] > 0):
                val = str(self.tape[i]) 
                if(i == self.tapePointer):
                    stringTape += 'X' + val
                else:
                    stringTape += '#' + val
            else:
                if(i == self.tapePointer):
                    stringTape += 'X'
                else:
                    stringTape += '#' 
        if(i < self.tapePointer):
            stringTape += 'X'
        else:
            stringTape += '#'
        
        return stringTape
    
    def loop(self):
        state = self.states[self.currentState]
        action = state['action']
        value = state['value']
        self.actionLog()

        if(action == 'halt'):
            return False

        if(action == 'ifEQ'):
            self.ifEQ(int(value))
            return True 

        if(action == 'ifGT'):
            self.ifGT(int(value))
            return True 

        if(action == 'goto'):
            self.goto(int(value))
            return True 

        if(action == 'const'):
            self.const(int(value))
        if(action == 'shR'):
            self.shR(int(value))
        if(action == 'shL'):
            self.shL(int(value))
        if(action == 'copy'):
            self.copy(int(value))
        if(action == 'add'):
            self.add()
        if(action == 'mult'):
            self.mult()
        if(action == 'monus'):
            self.monus()
        if(action == 'move'):
            value = value.split(',')
            j = int(value[0])
            k = int(value[1])
            self.move(j,k)

        self.currentState += 1
        return True

    def process(self, inputConfig):
        for i in inputConfig.split('#'):
            if(i.strip() != ''):
                self.tape.append(int(i))
        while(self.loop()):
            self.tapeLog()
        self.tapeLog()

    def const(self, k):
        if(len(self.tape) <= self.tapePointer):
            self.tape.append(k)
        else:
            self.tape[self.tapePointer] = k

    def shL(self, k):
        self.tapePointer -= k

    def shR(self, k):
        self.tapePointer += k

    def copy(self, k):
        offset = self.tapePointer - k
        k = self.tape[offset]
        self.const(k)
        self.shR(1)

    def move(self, j, k):
        start = self.tapePointer - j
        middle = self.tapePointer
        end = self.tapePointer + k
        self.tape[start:middle] = self.tape[middle:end]
        for i in range(middle,end):
            self.tape[i] = 0
        self.tapePointer = start

    def add(self):
        first = self.tapePointer
        second = self.tapePointer + 1
        self.tape[first] = self.tape[first] + self.tape[second]
        self.tape[second] = 0

    def mult(self):
        first = self.tapePointer
        second = self.tapePointer + 1
        self.tape[first] = self.tape[first] * self.tape[second]
        self.tape[second] = 0

    def monus(self):
        first = self.tapePointer
        second = self.tapePointer + 1
        self.tape[first] = self.tape[first] - self.tape[second]
        if(self.tape[first] < 0):
            self.tape[first] = 0
        self.tape[second] = 0
    
    def goto(self, t):
        self.currentState = t

    def swap(self):
        pass

    def ifEQ(self, t):
        first = self.tapePointer
        second = self.tapePointer + 1
        if(self.tape[first] == self.tape[second]):
            self.currentState = t
        else:
            self.currentState += 1
        self.tape[first] = 0
        self.tape[second] = 0

    def ifGT(self, t):
        first = self.tapePointer
        second = self.tapePointer + 1
        if(self.tape[first] > self.tape[second]):
            self.currentState = t
        else:
            self.currentState += 1
        self.tape[first] = 0
        self.tape[second] = 0

    def ifGE(self, t):
        pass

    def ifLE(self, t):
        pass

    def ifLT(self, t):
        pass

def simulate(data):
    states = data['states']
    inputConfig = data['input']
    program = Program(states)
    program.process(inputConfig)
    return {
        'tape': program.tape,
        'tapeString': program.getTapeString(),
        'actionLogs': program.actionLogs,
        'tapeLogs': program.tapeLogs,
        'logs': program.getLogs()
    }