module traffic_light (
    input wire clk,
    input wire reset_signal,
    input wire emergency_switch,
    output reg [1:0]light
);

localparam RED_LIGHT    = 2'b00;
localparam YELLOW_LIGHT = 2'b01;
localparam GREEN_LIGHT  = 2'b10;

reg [1:0]state_monitor;

always @(posedge clk) begin
    if (reset_signal) begin
        state_monitor <= 0;
        light <= RED_LIGHT;
    end else begin
        if (emergency_switch) begin
            state_monitor <= 0;
            light <= RED_LIGHT;
        end else begin
            state_monitor <= state_monitor + 1;
            case(light)
                RED_LIGHT: begin
                    if (state_monitor == 3) begin
                        state_monitor <= 0;
                        light <= GREEN_LIGHT;
                    end
                end
                YELLOW_LIGHT: begin
                    if (state_monitor == 1) begin
                        state_monitor <= 0;
                        light <= RED_LIGHT;
                    end
                end
                GREEN_LIGHT: begin
                    if (state_monitor == 3) begin
                        state_monitor <= 0;
                        light <= YELLOW_LIGHT;
                    end
                end
                default: light <= RED_LIGHT;
            endcase
        end
    end
end

endmodule

module test_traffic_light;
    reg test_clk;
    reg test_reset_signal;
    reg test_emergency_switch;
    wire [1:0]test_light;

traffic_light tl (
    .clk(test_clk),
    .reset_signal(test_reset_signal),
    .emergency_switch(test_emergency_switch),
    .light(test_light)
);

localparam RED_LIGHT    = 2'b00;
localparam YELLOW_LIGHT = 2'b01;
localparam GREEN_LIGHT  = 2'b10;

initial begin
    test_clk = 0;
end
always #5 test_clk = ~test_clk;

initial begin
    test_emergency_switch = 0;
    test_reset_signal = 1;
    #10;
    if (test_light == RED_LIGHT) begin
        $display("Correct Color After Reset");
    end else begin
        $display("Incorrect Color After Reset");
    end
    test_reset_signal = 0;
    #10;

    #40;
    if (test_light == GREEN_LIGHT) begin
        $display("Correct Color After 4 Ticks");
    end else begin
        $display("Incorrect Color After 4 Ticks");
    end
    #40;
    if (test_light == YELLOW_LIGHT) begin
        $display("Correct Color After 8 Ticks");
    end else begin
        $display("Incorrect Color After 8 Ticks");
    end
    test_emergency_switch = 1;
    #10;
    if (test_light == RED_LIGHT) begin
        $display("Correct Color During Emergency");
    end else begin
        $display("Incorrect Color During Emergency");
    end
    $finish;
end

endmodule