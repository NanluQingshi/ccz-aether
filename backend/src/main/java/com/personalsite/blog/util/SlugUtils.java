package com.personalsite.blog.util;

public final class SlugUtils {

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "";
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-")
                .replaceAll("^-|-$", "");
    }

    private SlugUtils() {}
}
