package com.adeel.wheeloffortune.model;

public enum Category {
    LOCATION_PLACE("Location / Place"),
    GENERAL_ITEM("General Item"),
    FRUIT_VEGETABLE("Fruit / Vegetable"),
    DISH("Dish"),
    SWEET("Sweet"),
    CANDY("Candy"),
    MOVIE("Movie"),
    ANIMAL("Animal"),
    SPORT("Sport"),
    OCCUPATION("Occupation"),
    TECHNOLOGY("Technology"),
    MUSIC("Music"),
    COUNTRY("Country");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
