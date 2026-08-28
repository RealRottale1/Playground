
module motion_detector (
    input sensor_a,
    input sensor_b,
    output motion_active,
);

assign motion_active = sensor_a | sensor_b;

endmodule



module security_system (
    input clk;
    input reset;
    input calm_1;
    input calm_2;
    output reg alarm_light;
    output reg [3:0] active_time;
);

wire movement_detected;
motion_detector md (
    .sensor_a(calm_1),
    .sensor_b(calm_2),
    .motion_active(movement_detected)
);

always @(posedge clk) begin
    if (reset == 1) begin
        alarm_light <= 0;
        active_time <= 0;
    end else if (movement_detected == 1) begin
        alarm_light <= 1;
        active_time <= active_time + 1;
    end
end

endmodule