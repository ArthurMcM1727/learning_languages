.data
    prompt: .asciiz "Hello World!"
    bye: .asciiz "Bye"

.text

    li $v0, 4
    la $a0, prompt  
    syscall

    la $a0, bye
    syscall

    li $v0, 10
    syscall