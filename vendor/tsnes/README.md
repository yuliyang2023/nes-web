Based on [nfam/tsnes](https://github.com/nfam/tsnes), npm release 0.0.2.
The original GPL-3.0 license and TypeScript declarations are included.

Changes in `dist/nes.js`:

- Register mapper 23 with VRC2b/VRC4f and VRC4e address aliases, PRG swap,
  1KB CHR banks, mirroring, and cycle/scanline VRC4 IRQs.
- Clock the IRQ from CPU time, including DMA stalls and VBlank. Keep its
  interrupt asserted until acknowledged.
- Correct the upstream 1KB CHR copy source offset and destination address.

References: [registers](https://www.nesdev.org/wiki/VRC2_and_VRC4),
[IRQ timing](https://www.nesdev.org/wiki/VRC_IRQ).
This preserves the legacy iNES combined VRC4 behavior; it does not add NES 2.0
submapper parsing or cycle-exact CPU execution to the original core.

Run `npm test`; optionally set `NES_TEST_ROM=/path/to/mapper23.nes` to run an
existing ROM for 1200 frames. ROMs are not included in this repository.
