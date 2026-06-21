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

# Take a0 params
factorial:
    bnez a0, skipBaseReturn
        lit a0, 1
        ret
    skipBaseReturn:

    mv t0, a0
    addi sp, sp, -8
    sw ra, 0(sp)
    sw t0, 4(sp) 

    addi a0, a0, -1
    jal factorial

    lw ra, 0(sp)
    lw t0, 4(sp)
    addi sp, sp 8
    mul a0, a0, t0
    ret

# Takes a0, a1 params
quickSort:
    addi sp sp, -32
    sw s0, 0(sp)                        # Left array
    sw s1, 4(sp)                        # Right array
    sw ra, 8(sp)                        # Return address
    sw s7, 12(sp)                       # Original array size
    sw s8, 16(sp)                       # Original array
    sw s9, 20(sp)                       # Split Value  
    sw s10, 24(sp)                      # Left array size
    sw s11, 28(sp)                      # Right array size

    srl t0, a1, 1                       # Get split point
    bnez t0, skipBaseReturn             # Base return case
        ret
    skipBaseReturn:
    mv s9, t0                           # Save split point
    mv s8, a0                           # Save original array
                       
    # Create left and right array
    li t1, 0                            # Ensure t1 is 0
    add t1, a0, t1                      # Get memory offset
    lw t0, 0(t1)                        # Get split value

    slli t1, a1, 2                      # Get new array size
    mv a0, t1                           # Memory allocation
    li a7, 9                            # Memory allocation
    ecall                               # Memory allocation
    mv s0, a0                           # Saving left array to s0

    mv a0, t1                           # Memory allocation
    li a7, 9                            # Memory allocation
    ecall                               # Memory allocation
    mv s1, a0                           # Saving right array to s1

    # Populate left and right array
    li t1, 0                            # Left index
    li t2, 0                            # Right index
    li t3, 0                            # Parent index
    sortLoop:
        beq t3, s9, skipSelf            # Ignore split index
            slli t4, t3, 2              # Multiply by 4
            add t4, t4, s8              # Index array
            lw t4, 0(t4)                # Access from memory

            bgt t4, t0, lessThan        # Greater than
                sll t5, t2, 2           # Multiply by 4
                add t5, t5, s1          # Index right array
                sw t4, 0(t5)            # Save to right array
                addi t2, t2, 1          # Increment right index
                j finally
            lessThan:                   # Less than or equal to
                sll t5, t2, 2           # Multiply by 4
                add t5, t5, s0          # Index left array
                sw t4, 0(t5)            # Save to left array
                addi t1, t1, 1          # Increment left index
            finally:

        skipSelf:
        addi t3, t3, 1                  # Increment parent index
        beq t3, a1, endSort             # Break case
        j sortLoop                      # Loops
    endSort:

    # Recursive function call
    mv s10, t1                          # Store left array size
    mv s11, t2                          # Store right array size
    mv s9, t0                           # Store split value

    mv a0, s0                           # Load left array
    mv a1, s10                          # Load left array size
    jal ra, quickSort                   # Call func on left array

    mv a0, s1                           # Load right array
    mv a1, s11                          # Load right array size
    jal ra, quickSort                   # Call func on right array

    # Combine left, right, and middle into single array
    li t0, 0
    putFromLeft:
        mv t1, t0                       # Clones index
        sll t1, t1, 2                   # Multiplies by 4
        mv t2, s0                       # Move to temp reg
        mv t3, s8                       # Move to temp reg
        add t2, t2, t1                  # Add index offset
        add t3, t3, t1                  # Add index offset
        lw t3, 0(t3)                    # Load left value
        sw t2, 0(t3)                    # Save left value to original array
        addi t0, t0, 1                  # Increment index
        beq t0, s10, endPutFromLeft     # Break condition
        j putFromLeft                   # Loop
    endPutFromLeft:

    # Redundent but I already did it
    mv t1, t0                           # Clones index
    sll t1, t1, 2                       # Multiplies by 4
    mv t3, s8                           # Move to temp reg
    add t3, t3, t1                      # Add index offset
    sw s9, 0(t3)                        # Save split value to original array
    add t0, t0, 1                       # Increment index

    li t6, 0                            # Right index
    putFromRight:
        mv t1, t6                       # Clones right index
        sll t1, t1, 2                   # Multiplies by 4
        mv t2, s1                       # Move to temp reg
        add t2, t2, t1                  # Add index offset
        lw t5, 0(t2)                    # Stores right index value

        mv t3, t0                       # Clones index
        sll t3, t3, 2                   # Multiplies by 4
        mv t4, s8                       # Move to temp reg
        add t4, t4, t3                  # Add index offset
        sw t5, 0(t4)                    # Save right index value to original array

        addi t6, t6, 1                  # Increment right index
        addi t0, t0, 1                  # Increment index
        beq t6, s11, endPutFromRight    # Break condition
        j putFromRight                  # Loop
    endPutFromRight:

    mv a0, s8                           # Sets return value
    mv a1, s7                           # Sets return value

    # Load prior state
    lw s0, 0(sp)                        # Left array
    lw s1, 4(sp)                        # Right array
    lw ra, 8(sp)                        # Return address
    lw s7, 12(sp)                       # Original array size
    lw s8, 16(sp)                       # Original array
    lw s9, 20(sp)                       # Split Value  
    lw s10, 24(sp)                      # Left array size
    lw s11, 28(sp)                      # Right array size
    addi sp, sp, 32                     # Free stack memory

    ret

