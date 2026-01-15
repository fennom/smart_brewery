import * as React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import RecipeItem from "../RecipeItem";

jest.mock("expo-font", () => {
  const actual = jest.requireActual("expo-font");
  return {
    ...actual,
    Font: {
      ...actual.Font,
      isLoaded: jest.fn(() => true),
    },
  };
});

describe("RecipeItem", () => {
  it(`calls onPress when the recipe item is pressed`, () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <RecipeItem no={1} name="Recipe 1" onPress={onPress} />
    );
    const pressRecipeItem = getByTestId("recipe-item");
    fireEvent.press(pressRecipeItem);

    expect(onPress).toHaveBeenCalled();
  });

  it("correctly displays the recipe item", () => {
    const { getByText } = render(
      <RecipeItem no={1} name="Recipe 1" onPress={() => {}} />
    );
    const recipeItem = getByText("Recipe 1");
    expect(recipeItem).toBeTruthy();
  });

  it("displays the recipe item number", () => {
    const { getByText } = render(
      <RecipeItem no={1} name="Recipe 1" onPress={() => {}} />
    );
    const recipeItem = getByText("1");
    expect(recipeItem).toBeTruthy();
  });

  it("displays the delete button when deletable is true", () => {
    const { getByTestId } = render(
      <RecipeItem no={1} name="Recipe 1" onPress={() => {}} deletable />
    );
    const deleteButton = getByTestId("delete-button");
    expect(deleteButton).toBeTruthy();
  });
});
