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
        li a0, t1
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
        li a0, t0
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