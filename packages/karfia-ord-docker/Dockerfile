# Based on https://github.com/ordinals/ord/blob/a3cd33eed95772e17f63e07cdab4a12bdc04f33b/Dockerfile
FROM rust:1.76.0-bookworm as builder
ARG BRANCH

WORKDIR /usr/src/ord

RUN git clone https://github.com/ordinals/ord.git --branch $BRANCH --depth 1 .

RUN cargo build --bin ord --release

FROM debian:bookworm-slim

COPY --from=builder /usr/src/ord/target/release/ord /usr/local/bin
RUN apt-get update && apt-get install -y openssl wait-for-it

ENV RUST_BACKTRACE=1
ENV RUST_LOG=info

EXPOSE 8080
CMD ["sh", "-c", "wait-for-it ${ORD_BITCOIN_HOST_PORT} -t 30 -- ord server --http-port 8080"]
