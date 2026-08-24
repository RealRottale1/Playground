module pin_checker (
    input [3:0] entered_pin,
    input [3:0] secret_pin,
    output is_match,
);
assign is_match = entered_pin == secret_pin;
endmodule

module digital_safe (
    input clk,
    input reset,
    input submit_btn,
    input [3:0] user_pin,
    output reg locked,
    output reg alarm,
);

wire match_signal;
reg [1:0] failed_attempts;

pin_checker pn (
    .entered_pin(user_pin),
    .secret_pin(4'b1010),
    .is_match(match_signal),
);

always @(posedge clk) begin
    if (reset == 1) begin
        locked <= 1;
        alarm <= 0;
        failed_attempts <= 0;
    end else if (submit_btn == 1 && alarm == 0) begin
        if (match_signal == 1) begin
            locked <= 0;
            failed_attempts <= 0;
        end else begin
            if (failed_attempts == 2) begin
                alarm <= 1;
            end else begin
                failed_attempts <= failed_attempts + 1;
            end
        end
    end
end

endmodule

module tb_digital_safe;
    reg clk;
    reg test_reset;
    reg test_submit_btn;
    reg [3:0] test_user_pin;
    wire test_locked;
    wire test_alarm;

digital_safe uut (
    .clk(clk),
    .reset(test_reset),
    .submit_btn(test_submit_btn),
    .user_pin(test_user_pin),
    .locked(test_locked),
    .alarm(test_alarm),
);

initial begin
    clk = 0;
end
always #5 clk = ~clk;

initial begin
    test_reset = 0;
    #10;

    test_user_pin = 4'b0000;
    test_submit_btn = 1;
    #10;
    test_submit_btn = 0;
    #10;

    test_user_pin = 4'b1010;
    test_submit_btn = 1;
    #10;
    test_submit_btn = 0;
    #10;
    if (test_locked == 0) begin
        $display("Locked");
    end else begin
        $display("Not Locked");
    end

    test_reset = 1;
    #10;
    test_reset = 0;
    #10;

    test_user_pin = 4'b0000;
    test_submit_btn = 1;    #10;    test_submit_btn = 0;    #10;
    test_submit_btn = 1;    #10;    test_submit_btn = 0;    #10;
    test_submit_btn = 1;    #10;    test_submit_btn = 0;    #10;

    if (test_alarm == 1) begin
        $display("Alarm going off");
    end else begin
        $display("No alarm");
    end
    $finish;
end
endmodule