module param_uart_tx #(
    parameter DATA_WIDTH = 8,
    parameter STOP_BITS = 1
)(
    input clk,
    input reset,
    input tx_start,
    input [DATA_WIDTH-1:0] tx_data,
    output reg tx_out,
    output wire busy,
    output reg done_pulse
);

localparam IDLE      = 2'b00;
localparam START_BIT = 2'b01;
localparam DATA_BITS = 2'b10;
localparam STOP_STATE = 2'b11;

reg [1:0] state;
reg [DATA_WIDTH-1:0] shift_reg;
reg [15:0] bit_index;
reg [15:0] stop_count;

always @(posedge clk) begin
    if (reset) begin
        state      <= IDLE;
        tx_out    <= 1;
        done_pulse <= 0;
    end else begin
        case(state)
            IDLE: begin
                tx_out <= 1;
                if (tx_start == 1) begin
                    shift_reg  <= tx_data;
                    bit_index  <= 0;
                    stop_count <= 0;
                    state      <= START_BIT;
                end
            end
            START_BIT: begin
                tx_out <= 0;
                state  <= DATA_BITS;
            end
            DATA_BITS: begin
                tx_out <= shift_reg[bit_index];
                bit_index <= bit_index + 1;
                if (bit_index == DATA_WIDTH-1) begin
                    state <= STOP_STATE;
                end
            end
            STOP_STATE: begin
                tx_out <= 1;
                stop_count <= stop_count + 1;
                if (stop_count == STOP_BITS - 1) begin
                    done_pulse <= 1;
                    state <= IDLE;
                end
            end
        endcase
    end
end

assign busy = (state != IDLE);

endmodule