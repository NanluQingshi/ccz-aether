package com.personalsite.blog.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class ChartVO {

    private List<MonthStat> monthlyTrend;
    private List<NameValue> categoryStats;
    private List<NameValue> tagStats;

    @Data
    public static class MonthStat {
        private String month;
        private long published;
        private long views;
    }

    @Data
    public static class NameValue {
        private String name;
        private long value;
    }
}
