module coin_validator (
    input weight_ok,
    input magnet_ok,
    output is_valid
);
    assign is_valid = weight_ok & magnet_ok;
endmodule

module vending_bank (
    input clk,
    input reset,
    input sensor_w,
    input sensor_m,
    output reg [7:0] coin_count
);
    wire valid_signal;
    coin_validator cv (
        .weight_ok(sensor_w),
        .magnet_ok(sensor_m),
        .is_valid(valid_signal)
    );
    always @(posedge clk) begin
        if (reset == 1) begin
            coin_count <= 0;
        end else if (valid_signal == 1) begin
            coin_count <= coin_count + 1;
        end else begin
            coin_count <= coin_count;
        end
    end
endmodule

module tb_vending_bank;
    reg clk;
    reg test_reset;
    reg test_sensor_m;
    reg test_sensor_w;
    wire [7:0] test_coin_amount;
vending_bank vb (
    .clk(clk),
    .reset(test_reset),
    .sensor_m(test_sensor_m),
    .sensor_w(test_sensor_w),
    .coin_count(test_coin_amount)
);

initial begin
    clk = 0;
end
always #5 clk = ~clk;

initial begin
    test_reset = 1;
    test_sensor_m = 0;
    test_sensor_w = 0;
    #10;
    test_reset = 0;
    #10;
    test_sensor_m = 1;
    test_sensor_w = 1;
    #10;
    test_sensor_m = 1;
    test_sensor_w = 0;
    #10;
    $finish;
end
endmodule
