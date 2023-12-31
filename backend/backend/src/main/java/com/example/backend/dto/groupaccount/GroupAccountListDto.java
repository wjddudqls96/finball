package com.example.backend.dto.groupaccount;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GroupAccountListDto {
    private String groupAccountNo;
    private String name;
    private long balance;
}
