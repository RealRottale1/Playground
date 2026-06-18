# Assembly Practice

# Takes a0 & a1 params
addAndDouble:
    add a0, a0, a1
    slli a0, a0, 1
    ret

# Takes a0 params
sumToN:
    li t0, 0
    li t1, 0
    loop:
        add t1, t1, t0
        addi t0, t0, 1
        ble t0, a0, done
        j loop
    done:
        mv a0, t1
        ret

# Takes a0: array & a1: size params
getLastElement:
    sub a1, a1, 1
    slli a1, a1, 2
    add a1, a1, a0
    lw a0, 0(a1)
    ret

# Takes a0
factorial:
    li t0, 1
    bgt a0, t0, returnCase
        mv a0, t0
        ret
    returnCase:

    addi sp, sp, -8
    sw ra, 0(sp)
    sw a0, 4(sp)
    
    add a0, a0, -1
    jal factorial
    lw t0, 4(sp)
    lw ra, 0(sp)
    mul a0, a0, t0 

    addi sp, sp, 8
    ret

# Takes a0: Array, a1: size, a2: target params
findIndex:
    li t0, 0
    loop:
    bge t0, a1, endLoop

    slli t1, t0, 2
    add t1, t1, a0
    lw t2, 0(t1)
    beq a2, t2, foundI

    addi t0, t0, 1
    j loop

    endLoop:
    # If index not found
    li a0, -1
    ret

    foundI:
    # If index found
    mv a0, t0
    ret

# Takes a0 params
countOnBits:
    li t0, 0
    li t1, 32

    loop:
    andi t2, a0, 1
    add t0, t0, t2
    srli a0, a0, 1

    addi t1, t1, -1
    bnez t1, endLoop
    j loop

    endLoop:
    mv a0, t0
    ret

# Takes a0 params
flipInt:
    li t0, 0
    li t2, 32
    loop:
        andi t1, a0, 1
        srli a0, a0, 1
        slli t0, t0, 1
        or t0, t0, t1
        addi t2, t2, -1
        beqz t2, endLoop 
        j loop
    endLoop:
    mv a0, t0
    ret

# Takes a0: a, a1: b, a2: startA, a3: lenA params 
packBits:
    li t0, 0                            # Return variable
    li t1, 32                           # Iterator

    mv t4, a2                           # Begins creating leftMost index
    add t4, t4, a3                      # Adds lengthA to startA
    addi t4, t4, -1                     # Subtracts one to maintain inclusivity

    li t5, t5, 2147483648               # Left most bit
    
    loop:                   
        bgt t1, t4, elseBlock           # Check if index is greater than left bound
        blt t1, a2, elseBlock           # Check if index is less than right bound
            and t2, a0, t5              # Gets left most value from a0
            j finallyBlock
        elseBlock:
            and t2, a1, t5              # Gets left most value from a1
        finallyBlock:

        srli a0, a0, 1                  # Shift right a0 by 1
        srli a1, a1, 1                  # Shift right a1 by 1

        srli t2, t2, 31
        ori t0, t0, t2                  # Set first t0 bit to t2 bit

        beqz t1, endLoop                # Exit case for index loop
        slli t0, t0, 1                  # Shift left t0 by 1

        addi t1, t1, -1                 # Decrements iterator by 1
        j loop                          # Repeats loop
    endLoop:
    mv a0, t0                           # Moves t0 to a0 to return result
    ret

packBitsFaster:
    li t0, 1
    slli t0, t0, a3
    addi t0, t0, -1
    slli t0, t0, a2

    mv t1, t0
    not t1, t1
    and a1, a1, t1
    and a0, a0, t0

    or a0, a0, a1
    ret

# Takes a0 params
isEven:
    mv t0, a0
    addi t0, t0, -1
    and a0, a0, t0
    beqz a0, even
    li a0, 1
    even:
    ret

# Takes a0: array, a1: size params
sumArray:
    li t0, 0                    # Iterator
    li t1, 0                    # Return value

    bgt a1, t0, skipEarlyReturn # Checks if size <= 0
        li a0, 0
        ret
    skipEarlyReturn:

    loop:
        sll t2, t0, 2           # Multiply iterator by 4
        add t2, t2, a0          # Add a0 to t2
        lw t3, 0(t2)            # Load data from array at index
        add t1, t1, t3          # Add data to total

        addi t0, t0, 1          # Increment index
        beq t0, a1, endLoop     # Break condition
        j loop    
    endLoop:

    mv a0, t1
    ret

# Takes a0, a1 params
findMaxValue:
    bnez a1, skipEarlyReturn
        ret                             # Returns empty array of size 0
    skipEarlyReturn:

    li t1, 1
    bne a1, t1, skipAnotherEarlyRetun   # Return 1st element in array of size 1
        lw a0, 0(a0)
        ret
    skipAnotherEarlyRetun:

    li t0, 1
    lw t1, 0(a0)
    loop:
        mv t2, t0
        sll t2, t2, 2
        add t2, a0, t2

        lw t2, 0(t2)
        ble t2, t1, newBiggest
            mv t1, t2
        newBiggest:

        addi t0, t0, 1
        beq t0, a1, breakLoop
        j loop

    breakLoop:
    mv a0, t1
    ret


