"use client";
import CreationDays from "./CreationDays";
import { Flood, RedSea, Plagues, Tabernacle, Camp } from "./StoryScenes";

const MAP = {
  creation: CreationDays,
  flood: Flood,
  redsea: RedSea,
  plagues: Plagues,
  tabernacle: Tabernacle,
  camp: Camp,
};

export default function Extra({ kind }) {
  const C = MAP[kind];
  return C ? <C /> : null;
}