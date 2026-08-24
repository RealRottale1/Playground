module microwave_ctrl (
    input clk,
    input reset,
    input door_open,
    input start_btn,
    input timer_done,
    output reg heating,
    output reg [1:0] state_led
);
localparam IDLE = 2'b00;
localparam COOKING = 2'b01;
localparam PAUSED = 2'b11;

always @(posedge clk) begin
    if (reset) begin
        state_led <= IDLE;
    end else begin
        case(state_led)
            IDLE: begin
                if (start_btn == 1 && door_open == 0) begin
                    state_led <= COOKING;
                end else begin
                    state_led <= IDLE;
                end
            end
            COOKING: begin
                if (door_open == 1) begin
                    state_led <= PAUSED;
                end else if (timer_done == 1) begin
                    state_led <= IDLE;
                end else begin
                    state_led <= COOKING;
                end
            end
            PAUSED: begin
                if (door_open == 0 && start_btn == 1) begin
                    state_led <= COOKING;
                end else begin
                    state_led <= PAUSED;
                end
            end
            default: state_led <= IDLE;
        endcase
    end
end
heating = state_led == COOKING;

endmodule

module tb_microwave_ctrl
    reg clk;
    reg test_reset;
    reg test_door_open;
    reg test_start_btn;
    reg test_timer_done;
    wire test_heating;
    wire [1:0] test_state_led;

microwave_ctrl uut (
    .clk(clk),
    .reset(test_reset),
    .door_open(test_door_open),
    .start_btn(test_start_btn),
    .timer_done(test_timer_done),
    .heating(test_heating),
    .state_led(test_state_led)
);

localparam IDLE = 2'b00;
localparam COOKING = 2'b01;
localparam PAUSED = 2'b11;

initial begin
    clk = 0;
end
always #5 clk = ~clk;

initial begin
    test_reset = 1; #10; test_reset = 0;

    test_door_open = 1; test_start_btn = 1;
    #10;
    if (test_state_led == IDLE) begin
        $display("In IDLE");
    end else begin
        $display("Not in IDLE");
    end
    #10;

    test_door_open = 0; test_start_btn = 1;
    #10;
    if (test_state_led == COOKING) begin
        $display("In COOKING");
    end else begin
        $display("Not in COOKING");
    end
    if (test_heating == 1) begin
        $display("Correct heating of true");
    end else begin
        $display("Incorrect heating of false");
    end
    #10;

    test_door_open = 1;
    #10;
    if (test_state_led == PAUSED) begin
        $display("In PAUSED");
    end else begin
        $display("Not in PAUSED");
    end
    if (test_heating == 0) begin
        $display("Correct heating of false");
    end else begin
        $display("Incorrect heating of true");
    end
    #10;

    test_door_open = 0; test_start_btn = 1;
    #10;
    if (test_state_led == COOKING) begin
        $display("In COOKING");
    end else begin
        $display("Not in COOKING");
    end
    #10;

    test_timer_done = 1;
    #10;
    if (test_state_led == IDLE) begin
        $display("In IDLE");
    end else begin
        $display("Not in IDLE");
    end
    if (test_heating == 0) begin
        $display("Correct heating of false");
    end else begin
        $display("Incorrect heating of true");
    end
    #10;

    $finish;
end
endmodule