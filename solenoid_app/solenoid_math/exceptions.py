class TooManyVariables(Exception):
    """Exception raised when too many variables are inputted

    Attributes:
        message -- Too many variables to solve for: Only 1 variable can be None
    """
    def __init__(self):
        self.message = "Too many variables to solve: Only 1 variable can be None"
        super().__init__(self.message)

class IncorrectDataType(Exception):
    """Exception raised when a variable is of the incorrect type

    Attributes:
        message -- Invalid data type (type) for variable
    """
    def __init__(self, type_in, variable):
        self.type = type_in
        self.variable = variable
        self.message = "Invalid data type (" + self.type + ") for '" + variable + "'"
        super().__init__(self.message)