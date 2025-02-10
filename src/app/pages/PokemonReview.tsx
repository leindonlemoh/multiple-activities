import React from "react";
import PreviewReview from "../components/PreviewReview";

const PokemonReview = ({ AddPokemon }: { AddPokemon: () => void }) => {
  return (
    <div>
      <PreviewReview item={""} />
    </div>
  );
};

export default PokemonReview;
